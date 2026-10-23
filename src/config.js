const remoteApiBaseURL = 'https://dev-backend.ai3dscanning.com/api';
const remoteAiApiBaseURL = 'https://ai3d_api.ai3dscanning.com';

const useLocalProxy = () => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
};

// Browser calls stay on this origin in local dev so the API CORS check is skipped.
// Next.js rewrites /api and /ai-api to the real backends.
export const baseURL = useLocalProxy() ? '/api' : remoteApiBaseURL;
export const aiApiBaseURL = useLocalProxy() ? '/ai-api' : remoteAiApiBaseURL;