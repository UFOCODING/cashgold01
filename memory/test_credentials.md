# CashGold – Test Credentials

## Admin
- Email: `admin@cashgold.com`
- Password: `admin123`
- Role: admin (is_admin=true)

## Notes
- Auth: Custom JWT bearer token (localStorage), no 2FA.
- Password policy (register): min 8 chars, must contain letters AND digits.
- Brute-force: 5 failed logins per account → 15 min lockout (HTTP 429).
- Rate limits: login 10/min, register 5/min, chatbot 15/min (per IP).

## Auth endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me
