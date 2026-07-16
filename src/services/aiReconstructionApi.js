import axios from 'axios';
import { aiApiBaseURL } from '../config';

const aiApi = axios.create({
  baseURL: aiApiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const COMPLETE_STATUSES = new Set(['completed', 'complete', 'done', 'success', 'finished']);
const FAILED_STATUSES = new Set(['failed', 'error', 'cancelled', 'canceled']);
const QUEUE_STATUSES = new Set(['pending', 'submitted', 'in_queue', 'queued', 'waiting', '']);
const PROCESSING_STATUSES = new Set(['processing', 'in_progress', 'running']);

export const createReconstructionJobId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const extractVideoFrames = (payload) =>
  aiApi.post('/video/extract_frames/', {
    link: payload.link,
    id: payload.id,
    is_production: payload.is_production ?? 0,
  });

export const parseExtractedFrameUrls = (response) => {
  const data = response?.data;
  const collections = [
    data?.images,
    data?.frames,
    data?.frame_urls,
    data?.urls,
    data?.data?.images,
    data?.data?.frames,
  ];

  for (const collection of collections) {
    if (!Array.isArray(collection) || collection.length === 0) continue;
    const urls = collection
      .map((item) => {
        if (typeof item === 'string') return item;
        return item?.temp_url || item?.url || item?.link || item?.secure_url;
      })
      .filter(Boolean);
    if (urls.length > 0) return urls;
  }

  return [];
};

export const parseFrameUrlsFromQueueItem = (item) => {
  if (!item) return [];

  const collections = [
    item.frames,
    item.images,
    item.frame_urls,
    item.output?.frames,
    item.output?.images,
    item.result?.frames,
    item.result?.images,
  ];

  for (const collection of collections) {
    if (!Array.isArray(collection) || collection.length === 0) continue;
    const urls = collection
      .map((entry) => {
        if (typeof entry === 'string') return entry;
        return entry?.temp_url || entry?.url || entry?.link || entry?.secure_url;
      })
      .filter(Boolean);
    if (urls.length > 0) return urls;
  }

  return [];
};

export const pollExtractedFrameUrls = async (
  jobId,
  cloudinaryUrl,
  { intervalMs = 5000, maxAttempts = 72, onProgress } = {},
) => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    onProgress?.(attempt + 1, maxAttempts);

    const queueResponse = await getReconstructionQueue();
    const items = normalizeQueueItems(queueResponse);
    const match = findQueueItemByJobId(items, jobId);
    const queueFrames = parseFrameUrlsFromQueueItem(match);
    if (queueFrames.length > 0) {
      return queueFrames;
    }

    for (const item of items) {
      const itemFrames = parseFrameUrlsFromQueueItem(item);
      if (itemFrames.length > 0) {
        return itemFrames;
      }
    }

    const rootFrames = parseExtractedFrameUrls(queueResponse);
    if (rootFrames.length > 0) {
      return rootFrames;
    }

    try {
      const extractResponse = await extractVideoFrames({
        link: cloudinaryUrl,
        id: jobId,
        is_production: 1,
      });
      const extractFrames = parseExtractedFrameUrls(extractResponse);
      if (extractFrames.length > 0) {
        return extractFrames;
      }
    } catch (err) {
      const message = String(err?.response?.data?.detail || err?.response?.data?.message || '').toLowerCase();
      if (message && !message.includes('wait') && !message.includes('queue')) {
        throw err;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error('Extracted frames are not available yet. Please try again.');
};

export const startReconstruction = (payload) =>
  aiApi.post('/reconstruction/v1/', {
    link: payload.link,
    id: payload.id,
    is_production: payload.is_production ?? 0,
    is_sequential: payload.is_sequential ?? 0,
  });

export const getSplatDownloadLink = (itemId) =>
  aiApi.get(`/reconstruction/download/${itemId}`);

export const getReconstructionQueue = () => aiApi.get('/reconstruction/queue');

export const normalizeQueueItems = (queueResponse) => {
  const data = queueResponse?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.queue)) return data.queue;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getQueuePosition = (item) => {
  if (!item) return null;
  const raw =
    item?.queue_position ??
    item?.position ??
    item?.queue ??
    item?.queue_no ??
    item?.queue_index;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
};

export const findQueueItemByJobId = (items, jobId) =>
  items.find((item) => {
    const candidates = [
      item?.id,
      item?.job_id,
      item?.request_id,
      item?.task_id,
      item?.item_id,
      item?.queue_item_id,
    ];
    return candidates.some((value) => value != null && String(value) === String(jobId));
  });

export const findQueueItemByItemId = (items, itemId) =>
  items.find((item) => {
    const candidates = [item?.item_id, item?.queue_item_id, item?.id, item?.job_id];
    return candidates.some((value) => value != null && String(value) === String(itemId));
  });

export const parseReconstructionStartResponse = (response, submittedJobId) => {
  const data = response?.data;
  const queuePosition = Number(data?.queue_position);
  return {
    jobId: submittedJobId,
    itemId: submittedJobId,
    queuePosition: Number.isFinite(queuePosition) ? queuePosition : null,
    message: data?.message ?? null,
  };
};

export const getQueueItemId = (item) =>
  item?.item_id ?? item?.queue_item_id ?? item?.id ?? item?.job_id;

export const parseDownloadUrl = (response) => {
  const data = response?.data;
  return (
    data?.url ||
    data?.link ||
    data?.download_url ||
    data?.splat_url ||
    data?.file_url ||
    (typeof data === 'string' ? data : null)
  );
};

export const getJobStatus = (item) => {
  if (!item) return 'waiting';

  const status = String(item?.status ?? item?.state ?? '').toLowerCase();
  if (COMPLETE_STATUSES.has(status) || FAILED_STATUSES.has(status) || PROCESSING_STATUSES.has(status)) {
    return status;
  }

  if (status && QUEUE_STATUSES.has(status)) {
    return status;
  }

  const position = getQueuePosition(item);
  if (position != null && position > 0) {
    return 'in_queue';
  }

  return status || 'waiting';
};

export const isQueueLikeStatus = (status) => QUEUE_STATUSES.has(status) || status === 'in_queue';

export const isProcessingLikeStatus = (status) => PROCESSING_STATUSES.has(status);

export const pollFrameExtractionQueueUntilDone = async (
  jobId,
  { intervalMs = 5000, maxAttempts = 120, graceAttempts = 3, onProgress } = {},
) => {
  let seenInQueue = false;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await getReconstructionQueue();
    const items = normalizeQueueItems(response);
    const match = findQueueItemByJobId(items, jobId);
    const status = match ? getJobStatus(match) : seenInQueue ? 'processing' : 'waiting';
    const queuePosition = getQueuePosition(match);

    if (match) {
      seenInQueue = true;
      onProgress?.(match, status, queuePosition, attempt);

      if (FAILED_STATUSES.has(status)) {
        throw new Error(match?.message || match?.error || 'Frame extraction failed');
      }
    } else if (seenInQueue) {
      onProgress?.(null, 'completed', null, attempt);
      return;
    } else if (attempt + 1 >= graceAttempts) {
      onProgress?.(null, 'waiting', null, attempt);
      return;
    } else {
      onProgress?.(null, status, queuePosition, attempt);
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error('Frame extraction is taking longer than expected. Please try again.');
};

const SPLAT_NOT_READY_PATTERN = /no \.splat file found/i;
const ITERATION_PATTERN = /iteration\s+(\d+)/i;
const ASSUMED_MAX_SPLAT_ITERATION = 30000;

export class ModelNotReadyError extends Error {
  constructor(message, iteration = null) {
    super(message);
    this.name = 'ModelNotReadyError';
    this.iteration = iteration;
  }
}

export const parseSplatNotReadyDetail = (error) => {
  const detail = error?.response?.data?.detail || error?.message || '';
  if (!SPLAT_NOT_READY_PATTERN.test(detail)) {
    return null;
  }

  const iterationMatch = String(detail).match(ITERATION_PATTERN);
  const iteration = iterationMatch ? Number(iterationMatch[1]) : null;

  return {
    detail: String(detail),
    iteration: Number.isFinite(iteration) ? iteration : null,
  };
};

const tryGetCompletedModel = async (itemId) => {
  try {
    const downloadResponse = await getSplatDownloadLink(itemId);
    const downloadUrl = parseDownloadUrl(downloadResponse);
    if (!downloadUrl) {
      throw new ModelNotReadyError('Model URL not found in download response');
    }
    return { item: null, itemId, queuePosition: null };
  } catch (error) {
    const notReady = parseSplatNotReadyDetail(error);
    if (notReady) {
      throw new ModelNotReadyError(notReady.detail, notReady.iteration);
    }
    throw error;
  }
};

const waitForModelDownload = async (itemId, onProgress, attempt) => {
  try {
    return await tryGetCompletedModel(itemId);
  } catch (error) {
    if (error instanceof ModelNotReadyError) {
      onProgress?.(null, 'processing', attempt, null, {
        splatIteration: error.iteration,
        message: error.message,
      });
      return null;
    }
    throw error;
  }
};

export const pollReconstructionUntilComplete = async (
  jobId,
  { intervalMs = 10000, maxAttempts = 1080, initialQueuePosition, onProgress } = {},
) => {
  let seenInQueue = false;
  let leftQueue = false;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await getReconstructionQueue();
    const items = normalizeQueueItems(response);
    const match = findQueueItemByJobId(items, jobId);
    const status = match
      ? getJobStatus(match)
      : leftQueue || seenInQueue
        ? 'processing'
        : 'waiting';
    const queuePosition =
      getQueuePosition(match) ??
      (!seenInQueue && attempt === 0 ? initialQueuePosition : null);

    if (match) {
      seenInQueue = true;
    } else if (seenInQueue) {
      leftQueue = true;
    }

    onProgress?.(match, status, attempt, queuePosition);

    if (match) {
      if (FAILED_STATUSES.has(status)) {
        throw new Error(match?.message || match?.error || 'Reconstruction failed');
      }

      if (COMPLETE_STATUSES.has(status) || isProcessingLikeStatus(status)) {
        const downloadResult = await waitForModelDownload(jobId, onProgress, attempt);
        if (downloadResult) {
          return downloadResult;
        }
      }
    } else if (leftQueue) {
      const downloadResult = await waitForModelDownload(jobId, onProgress, attempt);
      if (downloadResult) {
        return downloadResult;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(
    'Reconstruction is taking longer than expected. The .splat file is still being generated. Please try again later.',
  );
};

export const estimateSplatProgress = (iteration) => {
  if (!Number.isFinite(iteration) || iteration <= 0) {
    return null;
  }
  return Math.max(40, Math.min(95, Math.round((iteration / ASSUMED_MAX_SPLAT_ITERATION) * 95)));
};
