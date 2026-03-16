export const AUTH_COOKIE_NAME = 'auth_token';

export const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,          // REQUIRED for SameSite=None
    sameSite: 'none',
    path: '/',
    // maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    maxAge: 1000 * 60 * 2
};
