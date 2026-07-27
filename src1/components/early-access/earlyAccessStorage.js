export const EARLY_ACCESS_POPUP_DISMISSED_AT_KEY = 'ai3d_early_access_popup_dismissed_at';
const LEGACY_SEEN_KEY = 'ai3d_early_access_popup_seen';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const getDismissedAt = () => {
  const dismissedAt = localStorage.getItem(EARLY_ACCESS_POPUP_DISMISSED_AT_KEY);
  if (dismissedAt) {
    const parsed = Number(dismissedAt);
    return Number.isFinite(parsed) ? parsed : null;
  }

  // Migrate old permanent-dismiss flag to 24h window
  if (localStorage.getItem(LEGACY_SEEN_KEY) === '1') {
    const now = Date.now();
    localStorage.setItem(EARLY_ACCESS_POPUP_DISMISSED_AT_KEY, String(now));
    localStorage.removeItem(LEGACY_SEEN_KEY);
    return now;
  }

  return null;
};

export const shouldShowEarlyAccessPopup = () => {
  const dismissedAt = getDismissedAt();
  if (!dismissedAt) return true;
  return Date.now() - dismissedAt >= TWENTY_FOUR_HOURS_MS;
};

export const markEarlyAccessPopupDismissed = () => {
  localStorage.setItem(EARLY_ACCESS_POPUP_DISMISSED_AT_KEY, String(Date.now()));
  localStorage.removeItem(LEGACY_SEEN_KEY);
};
