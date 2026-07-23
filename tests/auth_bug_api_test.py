#!/usr/bin/env python3
import asyncio
import json
import os
import re
import time
import uuid
from pathlib import Path
from urllib.parse import urljoin

import requests
from dotenv import dotenv_values
from motor.motor_asyncio import AsyncIOMotorClient

ROOT = Path('/app')
FRONTEND_ENV = dotenv_values(ROOT / 'frontend' / '.env')
BACKEND_ENV = dotenv_values(ROOT / 'backend' / '.env')
BASE_URL = FRONTEND_ENV.get('REACT_APP_BACKEND_URL', 'http://localhost:8001').rstrip('/')
API = BASE_URL + '/api'
MONGO_URL = BACKEND_ENV.get('MONGO_URL')
DB_NAME = BACKEND_ENV.get('DB_NAME')
ADMIN_EMAIL = 'admin@cashgold.com'
ADMIN_PASSWORD = 'admin123'

results = []
seed_email = f"qa-auth-{int(time.time())}-{uuid.uuid4().hex[:8]}@example.com"
seed_password = 'Password123'


def record(name, ok, details=None):
    entry = {'name': name, 'ok': bool(ok), 'details': details or {}}
    results.append(entry)
    status = 'PASS' if ok else 'FAIL'
    print(f"{status}: {name} - {json.dumps(entry['details'], ensure_ascii=False, default=str)}")


async def db_prepare():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    try:
        await db.login_attempts.delete_many({'identifier': {'$in': [ADMIN_EMAIL, seed_email]}})
        admin = await db.users.find_one({'email': ADMIN_EMAIL}, {'_id': 0, 'email': 1, 'is_admin': 1, 'is_active': 1, 'password_hash': 1})
        record('mongo_admin_user_present', bool(admin), {
            'email': admin.get('email') if admin else None,
            'is_admin': admin.get('is_admin') if admin else None,
            'is_active': admin.get('is_active') if admin else None,
            'password_hash_prefix': (admin.get('password_hash') or '')[:4] if admin else None,
        })
        indexes = await db.users.index_information()
        record('mongo_users_email_index_present', any('email' in [k[0] for k in idx.get('key', [])] for idx in indexes.values()), {'indexes': list(indexes.keys())})
    finally:
        client.close()


def post(path, payload):
    return requests.post(API + path, json=payload, timeout=20)


def get(path, token=None):
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    return requests.get(API + path, headers=headers, timeout=20)


def assert_token_user_response(data):
    return bool(data.get('access_token') and data.get('user') and data['user'].get('email'))


def main():
    print(json.dumps({'base_url': BASE_URL, 'api': API, 'seed_email': seed_email}, indent=2))
    asyncio.run(db_prepare())

    # Valid strong-password registration.
    r = post('/auth/register', {'email': seed_email, 'username': 'QA Auth User', 'password': seed_password, 'referral_code': None})
    reg_json = safe_json(r)
    record('api_valid_register_strong_password_returns_token_user', r.status_code == 200 and assert_token_user_response(reg_json), {
        'status': r.status_code, 'body': redact(reg_json)
    })
    reg_token = reg_json.get('access_token') if isinstance(reg_json, dict) else None
    if reg_token:
        me = get('/auth/me', reg_token)
        record('api_registered_token_reaches_auth_me', me.status_code == 200 and safe_json(me).get('email') == seed_email.lower(), {
            'status': me.status_code, 'body': redact(safe_json(me))
        })
    else:
        record('api_registered_token_reaches_auth_me', False, {'reason': 'no token from register'})

    # Weak registration validation with clear backend messages.
    for weak_password, label in [('test', 'too_short'), ('password', 'letters_only')]:
        weak_email = f"qa-auth-{label}-{int(time.time())}-{uuid.uuid4().hex[:6]}@example.com"
        wr = post('/auth/register', {'email': weak_email, 'username': 'Weak User', 'password': weak_password, 'referral_code': None})
        body = safe_json(wr)
        detail = body.get('detail') if isinstance(body, dict) else str(body)
        clear = isinstance(detail, str) and bool(detail.strip()) and ('mot de passe' in detail.lower() or 'password' in detail.lower() or 'lettres' in detail.lower() or 'chiffres' in detail.lower())
        record(f'api_weak_register_rejected_{label}', wr.status_code == 400 and clear, {'status': wr.status_code, 'detail': detail})

    # Admin login and admin endpoint reachability.
    ar = post('/auth/login', {'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD})
    admin_json = safe_json(ar)
    admin_ok = ar.status_code == 200 and assert_token_user_response(admin_json) and admin_json['user'].get('is_admin') is True
    record('api_admin_login_returns_token_user', admin_ok, {'status': ar.status_code, 'body': redact(admin_json)})
    admin_token = admin_json.get('access_token') if isinstance(admin_json, dict) else None
    if admin_token:
        stats = get('/admin/stats', admin_token)
        record('api_admin_token_reaches_admin_stats', stats.status_code == 200 and isinstance(safe_json(stats), dict) and 'total_users' in safe_json(stats), {'status': stats.status_code, 'body': safe_json(stats)})
    else:
        record('api_admin_token_reaches_admin_stats', False, {'reason': 'no admin token'})

    # Invalid login and brute-force lockout on the created test account.
    bad_statuses = []
    for i in range(1, 7):
        br = post('/auth/login', {'email': seed_email, 'password': f'WrongPassword{i}'})
        body = safe_json(br)
        bad_statuses.append({'attempt': i, 'status': br.status_code, 'detail': body.get('detail') if isinstance(body, dict) else str(body)})
        time.sleep(0.05)
    first_invalid_ok = bad_statuses[0]['status'] == 401
    locked_ok = any(x['status'] == 429 for x in bad_statuses[4:])
    record('api_invalid_login_then_lockout', first_invalid_ok and locked_ok, {'attempts': bad_statuses})

    ok_count = sum(1 for r in results if r['ok'])
    report = {
        'base_url': BASE_URL,
        'seed_email': seed_email,
        'passed': ok_count,
        'failed': len(results) - ok_count,
        'results': results,
    }
    Path('/app/test_reports/auth_bug_api_results.json').write_text(json.dumps(report, indent=2, ensure_ascii=False, default=str))
    if report['failed']:
        raise SystemExit(1)


def safe_json(resp):
    try:
        return resp.json()
    except Exception:
        return {'raw': resp.text[:500]}


def redact(obj):
    if not isinstance(obj, dict):
        return obj
    clone = json.loads(json.dumps(obj, default=str))
    if 'access_token' in clone:
        clone['access_token'] = clone['access_token'][:16] + '...'
    return clone


if __name__ == '__main__':
    main()
