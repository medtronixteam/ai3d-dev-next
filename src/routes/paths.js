export const rootPaths = {
  root: '/',
  pageRoot: '', 
  authRoot: '',
  errorRoot: 'error'
};

export const isDashboardHomePath = (pathname) =>
  pathname === '/3dio' || pathname === '/3dio/';

export const MODEL_GENERATOR_FAST = '/3dio/model-generator/fast';
export const MODEL_GENERATOR_QUALITY = '/3dio/model-generator/quality';

export const modelGeneratorPath = (mode = 'fast', slug) => {
  const base = mode === 'quality' ? MODEL_GENERATOR_QUALITY : MODEL_GENERATOR_FAST;
  if (!slug) return base;
  return `${base}/${encodeURIComponent(slug)}`;
};

export const generatorModeFromPath = (pathname = '') =>
  pathname === MODEL_GENERATOR_QUALITY || pathname.startsWith(`${MODEL_GENERATOR_QUALITY}/`)
    ? 'quality'
    : 'fast';

export const isModelGeneratorPath = (pathname = '') =>
  pathname === MODEL_GENERATOR_FAST ||
  pathname === MODEL_GENERATOR_QUALITY ||
  pathname.startsWith(`${MODEL_GENERATOR_FAST}/`) ||
  pathname.startsWith(`${MODEL_GENERATOR_QUALITY}/`) ||
  pathname === '/3dio/new/scan' ||
  pathname.startsWith('/3dio/new/scan/');

export default {
  dashboard: '/3dio/',
  analytics: '/3dio/analytics',
  invoice: '/3dio/invoice',
  schedule: '/3dio/schedule',
  calendar: '/3dio/calendar',
  messages: '/3dio/messages',
  notification: '/3dio/notification',
  settings: '/3dio/settings',
  signin: '/signin',
  signup: '/signup',
  resetPassword: '/reset-password',
  404: `/${rootPaths.errorRoot}/404`,
  enterprise: '/3dio/enterprise',
  student: '/student-program',
  models: '/3dio/models',
  workspace: '/3dio/workspace',
  recentProjects: '/3dio/models',
  simple: '/3dio/simple',
  subscription: '/3dio/subscription',
  team: '/3dio/settings/team',
  referal: '/3dio/settings/referal',
  aimodal: '/3dio/settings/aimodal',
  project: '/3dio/settings/project',
  about: '/about-us',
};