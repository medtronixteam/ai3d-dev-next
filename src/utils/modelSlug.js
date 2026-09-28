export const slugifyTitle = (title) => {
  const slug = String(title || 'model')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'model';
};

/** URL slug: `ring--01kpayzc8vt18fm1411415pp2p` */
export const createModelSlug = (model) => {
  if (!model?.id) return '';
  return `${slugifyTitle(model.title || model.name)}--${model.id}`;
};

export const parseModelSlug = (slug) => {
  if (!slug) return { titleSlug: '', id: null };
  const decoded = decodeURIComponent(String(slug));
  const idx = decoded.lastIndexOf('--');
  if (idx === -1) {
    return { titleSlug: decoded, id: decoded };
  }
  return {
    titleSlug: decoded.slice(0, idx),
    id: decoded.slice(idx + 2) || null,
  };
};

export const getModelStats = (model) => {
  if (!model) return { hasViews: false, hasDownloads: false, views: 0, downloads: 0 };

  const hasViews = Object.prototype.hasOwnProperty.call(model, 'views')
    || Object.prototype.hasOwnProperty.call(model, 'views_count');
  const hasDownloads = Object.prototype.hasOwnProperty.call(model, 'downloads')
    || Object.prototype.hasOwnProperty.call(model, 'downloads_count');

  return {
    hasViews,
    hasDownloads,
    views: Number(model.views ?? model.views_count ?? 0) || 0,
    downloads: Number(model.downloads ?? model.downloads_count ?? 0) || 0,
  };
};
