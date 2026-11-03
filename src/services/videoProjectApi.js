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

  const message = String(data?.message || data?.error || '');
  const lowerMessage = message.toLowerCase();
  const apiStatus = String(data?.status || '').toLowerCase();
  const timedOut =
    lowerMessage.includes('taking longer') ||
    lowerMessage.includes('timed out') ||
    lowerMessage.includes('timeout');
  const hardFailure =
    !timedOut &&
    (FAILED_STATUSES.has(apiStatus) ||
      /\b(fail|failed|failure|error|cancelled|canceled)\b/.test(lowerMessage));
  const stillWorking =
    timedOut ||
    (!hardFailure &&
      (lowerMessage.includes('extract') ||
        lowerMessage.includes('wait') ||
        lowerMessage.includes('processing') ||
        lowerMessage.includes('queue') ||
        lowerMessage.includes('pending')));

  if (hardFailure) {
    return {
      status: 'failed',
      frames: [],
      message: message || 'Frame extraction failed',
    };
  }

  if (stillWorking || (data?.success === false && message)) {
    return {
      status: 'pending',
      frames: [],
      message: message || 'Extracting frames, please wait...',
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
      {
        headers: authHeaders(authToken),
        timeout: 0,
      },
    );

    return parseFramesResponse(response);
  } catch (err) {
    if (err?.response?.data) {
      return parseFramesResponse(err.response);
    }
    return {
      status: 'pending',
      frames: [],
      message: null,
    };
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
    onFrameProgress,
    onPending,
    onAttempt,
  } = {},
) => {
  const reportProgress = onFrameProgress || onAttempt;
  let attempt = 0;

  while (true) {
    attempt += 1;
    reportProgress?.(attempt, null);

    const parsed = await fetchProjectFramesStatus(projectToken, authToken);

    if (parsed.status === 'ready' && parsed.frames.length > 0) {
      return parsed.frames;
    }

    if (parsed.status === 'failed') {
      throw new Error(parsed.message || 'Frame extraction failed');
    }

    onPending?.(parsed.message, attempt);
    await delay(intervalMs);
  }
};

export const generateVideoProject = async (projectToken, paths = [], authToken) => {
  const response = await axios.post(
    `${baseURL}/projects/video/generate`,
    {
      token: projectToken,
      paths: paths || [],
    },
    {
      headers: authHeaders(authToken),
    },
  );

  const newToken = response.data?.token;
  if (!newToken) {
    throw new Error('No project token returned from video generation');
  }

  return newToken;
};

