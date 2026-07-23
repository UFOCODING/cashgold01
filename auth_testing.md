# Auth Testing Playbook (custom JWT email/password)

- Verify MongoDB users/login_attempts state for auth flow.
- Test POST /api/auth/register valid strong password returns access_token + user.
- Test weak passwords return HTTP 400 with clear detail.
- Test POST /api/auth/login valid credentials returns access_token + user, and token works for /api/auth/me.
- Test invalid login returns HTTP 401 and repeated failures lock account with HTTP 429.
- Test UI register/login pages show success/error toasts and navigate to dashboard/admin.
