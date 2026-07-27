const IMAGE_GUIDELINES_DISMISSED_PREFIX = 'ai3d_image_guidelines_dismissed_';

const getStorageKey = (email) => `${IMAGE_GUIDELINES_DISMISSED_PREFIX}${email || 'guest'}`;

export const shouldShowImageGuidelines = (email) => {
  if (!email) return true;
  return localStorage.getItem(getStorageKey(email)) !== '1';
};

export const markImageGuidelinesDismissed = (email) => {
  if (!email) return;
  localStorage.setItem(getStorageKey(email), '1');
};
