export const POST_LOGIN_REDIRECT_KEY = 'postLoginRedirect';

const API_ORIGIN = 'https://app.ai3dscanning.com';

export const GOOGLE_AUTH_URL = `${API_ORIGIN}/auth/google`;
export const FACEBOOK_AUTH_URL = `${API_ORIGIN}/auth/facebook`;

export const getPostLoginPath = () => {
  const inviteToken = localStorage.getItem('invite_token');
  if (inviteToken) {
    return `/3dio/team/invite/accept/${inviteToken}`;
  }

  const stored = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  if (stored) {
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    return stored;
  }

  return '/3dio/';
};

export const markSocialLoginRedirect = (path = '/3dio/') => {
  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, path);
};

export const startGoogleLogin = () => {
  markSocialLoginRedirect('/3dio/');
  window.location.href = GOOGLE_AUTH_URL;
};

export const startFacebookLogin = () => {
  markSocialLoginRedirect('/3dio/');
  window.location.href = FACEBOOK_AUTH_URL;
};
