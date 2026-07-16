const SCAN_WELCOME_SEEN_PREFIX = 'ai3d_scan_welcome_seen_';

const getStorageKey = (email) => `${SCAN_WELCOME_SEEN_PREFIX}${email || 'guest'}`;

export const shouldShowScanWelcome = (email) => {
  if (!email) return false;
  return localStorage.getItem(getStorageKey(email)) !== '1';
};

export const markScanWelcomeSeen = (email) => {
  if (!email) return;
  localStorage.setItem(getStorageKey(email), '1');
};
