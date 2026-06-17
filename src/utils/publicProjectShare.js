import axios from 'axios';
import { baseURL } from '../config';

const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  return url.replace(/\\\//g, '/').trim();
};

/** Only use public_url from API — never build URL on frontend. */
export const extractPublicUrl = (data) => {
  if (!data) return null;
  const nested = data.data ?? data;

  return normalizeUrl(
    data.public_url ??
      nested?.public_url ??
      null,
  );
};

export const extractPublicSlug = (data) => {
  const publicUrl = extractPublicUrl(data);
  if (!publicUrl) return null;

  const match = publicUrl.match(/\/(?:public\/)?project(?:\/public)?\/([^/?#]+)\/?$/);
  return match?.[1] ?? null;
};

export const makeProjectPublic = async (projectId, authToken) => {
  const response = await axios.post(
    `${baseURL}/project/make-public`,
    { project_id: projectId },
    { headers: { Authorization: `Bearer ${authToken}` } },
  );

  const url = extractPublicUrl(response.data);

  if (!url) {
    const err = new Error(
      response.data?.message || 'Share link not returned from server.',
    );
    err.response = response;
    throw err;
  }

  return {
    url,
    slug: extractPublicSlug(response.data),
    raw: response.data,
  };
};

export const isPublicProjectRoute = (pathname) =>
  pathname.startsWith('/public/project/') || /^\/project\/[^/]+$/.test(pathname);

export const fetchPublicProject = async (slug) => {
  const response = await axios.get(`${baseURL}/project/public/${slug}`);
  const payload = response.data?.data ?? response.data;
  const project = payload?.project ?? payload?.data ?? payload;

  let modelUrl =
    project?.splat_url ??
    project?.splat_file_url ??
    project?.model_url ??
    project?.url ??
    project?.temp_url ??
    payload?.splat_url ??
    payload?.model_url ??
    payload?.temp_url ??
    null;

  if (modelUrl) {
    modelUrl = normalizeUrl(modelUrl);
  }

  return { project, modelUrl };
};
