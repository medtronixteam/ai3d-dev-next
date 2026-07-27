import axios from 'axios';
import { baseURL } from '../config';

const authHeaders = (authToken) => ({
  Authorization: `Bearer ${authToken}`,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const COMPLETE_STATUSES = new Set(['completed', 'complete', 'done', 'success', 'finished']);
const FAILED_STATUSES = new Set(['failed', 'error', 'cancelled', 'canceled']);

export const submitVideoPublicUrl = async (publicUrl, authToken) => {
  const response = await axios.post(
    `${baseURL}/projects/video/url`,
    { publicUrl },
    { headers: authHeaders(authToken) },
  );

  const projectToken = response.data?.token;
  if (!projectToken) {
    throw new Error('Video project token not returned');
  }

  return {
    token: projectToken,
    publicUrl: response.data?.publicUrl || publicUrl,
  };
};

export const parseFramesResponse = (response) => {
  const data = response?.data;
  const images = data?.images;

  if (Array.isArray(images) && images.length > 0) {
    const frames = images
      .map((img) => ({
        name: img.name,
        temp_url: img.temp_url || img.url,
      }))
      .filter((img) => img.temp_url);

    return {
      status: 'ready',
      frames,
      folder: data?.folder || null,
      count: data?.count ?? frames.length,
      message: data?.message || null,
    };
  }

  const message = String(data?.message || '').toLowerCase();
  if (
    message.includes('extract') ||
    message.includes('wait') ||
    message.includes('processing') ||
    message.includes('queue')
  ) {
    return {
      status: 'pending',
      frames: [],
      message: data?.message || 'Extracting frames, please wait...',
    };
  }

  if (data?.success === false && message) {
    return {
      status: 'pending',
      frames: [],
      message: data.message,
    };
  }

  return {
    status: 'pending',
    frames: [],
    message: data?.message || null,
  };
};

export const fetchProjectFramesStatus = async (projectToken, authToken) => {
  try {
    const response = await axios.post(
      `${baseURL}/projects/frames`,
      { token: projectToken },
      { headers: authHeaders(authToken) },
    );

    return parseFramesResponse(response);
  } catch (err) {
    if (err?.response?.data) {
      return parseFramesResponse(err.response);
    }
    throw err;
  }
};

export const waitForVideoExtractionSignal = ({ timeoutMs = 10 * 60 * 1000 } = {}) =>
  new Promise((resolve) => {
    let settled = false;
    let timeoutId;

    const finish = (source) => {
      if (settled) return;
      settled = true;
      window.removeEventListener('videoProcessingComplete', onVideoComplete);
      if (timeoutId) clearTimeout(timeoutId);
      resolve(source);
    };

    const onVideoComplete = () => finish('notification');

    window.addEventListener('videoProcessingComplete', onVideoComplete);
    timeoutId = setTimeout(() => finish(null), timeoutMs);
  });

export const waitForFrameExtractionSocket = (subscribe, { timeoutMs = 10 * 60 * 1000 } = {}) =>
  new Promise((resolve) => {
    if (typeof subscribe !== 'function') {
      resolve(null);
      return;
    }

    let settled = false;
    let timeoutId;
    let unsubscribe = () => {};

    const finish = (result) => {
      if (settled) return;
      settled = true;
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
      resolve(result);
    };

    unsubscribe = subscribe('frame_extraction', (data) => {
      const status = String(data?.status ?? '').toLowerCase();
      const message = String(data?.message ?? '').toLowerCase();

      if (COMPLETE_STATUSES.has(status) || message.includes('complete') || message.includes('ready')) {
        finish(data);
        return;
      }

      if (FAILED_STATUSES.has(status)) {
        finish({ error: data?.message || 'Frame extraction failed' });
      }
    });

    timeoutId = setTimeout(() => finish(null), timeoutMs);
  });

export const waitForVideoFrameQueue = async ({ subscribe, timeoutMs = 10 * 60 * 1000 } = {}) => {
  const result = await Promise.race([
    waitForVideoExtractionSignal({ timeoutMs }),
    waitForFrameExtractionSocket(subscribe, { timeoutMs }),
  ]);

  if (result?.error) {
    throw new Error(result.error);
  }

  return result;
};

export const pollProjectFramesUntilReady = async (
  projectToken,
  authToken,
  {
    intervalMs = 5000,
    maxFrameAttempts = 72,
    onFrameProgress,
    onPending,
    onAttempt,
  } = {},
) => {
  const reportProgress = onFrameProgress || onAttempt;

  for (let attempt = 0; attempt < maxFrameAttempts; attempt += 1) {
    reportProgress?.(attempt + 1, maxFrameAttempts);

    const parsed = await fetchProjectFramesStatus(projectToken, authToken);

    if (parsed.status === 'ready' && parsed.frames.length > 0) {
      return parsed.frames;
    }

    onPending?.(parsed.message, attempt + 1);

    await delay(intervalMs);
  }

  throw new Error('Frame extraction is taking longer than expected. Please try again.');
};

export const generateVideoProject = async (projectToken, paths = [], authToken) => {
  const formData = new FormData();
  formData.append('token', projectToken);
  formData.append('paths', JSON.stringify(paths));

  const response = await axios.post(`${baseURL}/projects/video/generate`, formData, {
    headers: {
      ...authHeaders(authToken),
      'Content-Type': 'multipart/form-data',
    },
  });

  const newToken = response.data?.token;
  if (!newToken) {
    throw new Error('No project token returned from video generation');
  }

  return newToken;
};
