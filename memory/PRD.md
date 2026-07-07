# CashGold – Product Requirements Document

## Original Problem Statement
Complete online investment platform "CashGold". Modern elegant gold & black theme.
- Auth: Custom JWT email/password (NO 2FA/OTP — user explicitly removed it).
- Deposits/Withdrawals: USDT TRC20. Manual admin validation. Deposit max wait 12h. Withdrawal 30min–24h.
- Investment Plans (VIP): $10 minimum, 5% daily return.
- User Dashboard: balance, investments, daily profits, history, invest button.
- Admin Dashboard: user mgmt, deposit/withdrawal validation, stats.
- Bonuses: $6 registration bonus, referral link (5% bonus on referred deposits).
- Multilingual: 6 languages.
- AI Chatbot: 24/7 support (Emergent LLM, gpt-4o-mini).

## User language: French (fr-FR). Always reply to user in French.

## Architecture
- Backend: FastAPI (`/app/backend/server.py`), MongoDB (motor). All routes `/api` prefixed.
- Frontend: React + Tailwind + Shadcn. Calls via REACT_APP_BACKEND_URL.
- Scripts: `/app/scripts/calculate_profits.py` (cron 5% daily), `create_admin.py`.
- Integrations: emergentintegrations (LLM key) for chatbot.

## Implemented (as of 2026-07-06)
- JWT auth (no 2FA), $6 signup bonus, VIP plans 5%/day.
- User + Admin dashboards, gold/black theme, 6 languages.
- Manual deposit/withdrawal flow; 12h deposit auto-expiration; withdrawal daily limit.
- Stop investment → returns capital + accrued profit to balance.
- Referral 5% bonus on approved deposits.
- AI chatbot (public, gpt-4o-mini).
- **Security hardening (2026-07-06)**:
  - Fixed PyJWT exception bug (`jwt.JWTError` → `InvalidTokenError`); invalid token now 401 not 500.
  - Strong random SECRET_KEY (env-required, no fallback).
  - Brute-force protection: 5 fails/account → 15min lockout (429).
  - Password strength: min 8 chars + letters & digits.
  - Rate limiting (slowapi): login 10/min, register 5/min, chatbot 15/min.
  - Input validation: amounts must be > 0 (deposit/withdrawal/investment).
  - Atomic balance deduction (prevents double-spend race) on withdrawal & investment.
  - Security headers (X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy).
  - Chatbot input length cap (1000) + env-required LLM key (no hardcoded fallback).
  - Email normalized to lowercase; unique index on users.email.

## i18n full coverage (2026-07-07)
- Fixed: only HomePage was translated; language change now applies to ALL pages.
- Wired `useLanguage`/`t()` into Login, Register, Dashboard, Admin, FAQ, About, Contact.
- Added `LanguageSelector` to every page nav (previously only on HomePage).
- New `/app/frontend/src/i18n/translationsPages.js` (common, toast, faqPage, aboutPage, contactPage) merged into `translations.js` for all 6 languages.
- Removed stray junk `<a>` link in AdminDashboard users tab.
- Verified via screenshots: Login (EN), FAQ full Q&A (DE), Admin dashboard (ES).

## Backlog / Remaining
- P1: Full end-to-end verification of referral bonus flow (curl/testing agent).
- P2: Anti-fraud system / user activity logs tab in admin dashboard.
- P2: Suppress webpack dev overlay warning that can block UI clicks.
- P2: Refactor server.py into routers/models as it grows.
- P3: Consider CSRF/refresh-token/httpOnly cookies if moving off localStorage bearer tokens.

## Test Credentials
See `/app/memory/test_credentials.md`. Admin: admin@cashgold.com / admin123.
