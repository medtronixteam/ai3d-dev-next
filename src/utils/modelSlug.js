/** Prefer backend `slug`; fallback only if API omits it. */
export const getModelSlug = (model) => {
  if (!model) return '';
  if (model.slug) return String(model.slug).trim();
  // Legacy fallback for older payloads without slug
  const title = String(model.title || model.name || 'model')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'model';
  return model.id ? `${title}--${model.id}` : title;
};

export const getModelStats = (model) => {
  if (!model) return { hasViews: false, hasDownloads: false, views: 0, downloads: 0 };

  const hasViews =
    Object.prototype.hasOwnProperty.call(model, 'views') ||
    Object.prototype.hasOwnProperty.call(model, 'views_count');
  const hasDownloads =
    Object.prototype.hasOwnProperty.call(model, 'downloads') ||
    Object.prototype.hasOwnProperty.call(model, 'downloads_count');

  return {
    hasViews,
    hasDownloads,
    views: Number(model.views ?? model.views_count ?? 0) || 0,
    downloads: Number(model.downloads ?? model.downloads_count ?? 0) || 0,
  };
};
