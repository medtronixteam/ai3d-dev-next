export const rootPaths = {
  root: '/',
  pageRoot: '', 
  authRoot: '',
  errorRoot: 'error'
};

export const isDashboardHomePath = (pathname) =>
  pathname === '/3dio' || pathname === '/3dio/';

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
  models: '/3dio/models',
  workspace: '/3dio/workspace',
  recentProjects: '/3dio/models',
  simple: '/3dio/simple',
  subscription: '/3dio/subscription',
  team: '/3dio/settings/team',
  referal: '/3dio/settings/referal',
  aimodal: '/3dio/settings/aimodal',
  project: '/3dio/settings/project'
  
};