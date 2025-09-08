/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import ProtectedRoute from 'components/ProtectedRoute';
import CardPayment from '../pages/subscription/CardPayment';
import ApiSdkComingSoon from '../pages/api-sdk';
import Support from '../pages/support';
import Service from '../pages/Service';
import Referral from '../pages/referral';

// LAZY IMPORTS
const App = lazy(() => import('../App'));
const MainLayout = lazy(() => import('layouts/main-layout'));
const AuthLayout = lazy(() => import('layouts/auth-layout'));
const LandingPage = lazy(() => import('pages/LandingPage'));
const Schedule = lazy(() => import('pages/schedule'));
const Dashboard = lazy(() => import('pages/dashboard'));
const SignIn = lazy(() => import('pages/authentication/SignIn'));
const SignUp = lazy(() => import('pages/authentication/SignUp'));
const ResetPassword = lazy(() => import('pages/authentication/ResetPassword'));
const Error404 = lazy(() => import('pages/errors/Error404'));
const RecentProjects = lazy(() => import('pages/dashboard/RecentProjects'));
const SimplePage = lazy(() => import('pages/dashboard/SimplePage'));
const Subscription = lazy(() => import('pages/subscription'));
const Team = lazy(() => import('pages/team'));
const ScanPage = lazy(() => import('../pages/scan'));
const PreviewPage = lazy(() => import('pages/preview'));
const SplatViewer = lazy(() => import('pages/splat-viewer'));
const SettingsPage = lazy(() => import('pages/settings'));
const Profile = lazy(() => import('pages/settings/Profile'));
const Account = lazy(() => import('pages/settings/Account'));
const Security = lazy(() => import('pages/settings/Security'));
const LoginSettings = lazy(() => import('pages/settings/Login'));
const SubscriptionSettings = lazy(() => import('pages/settings/Subscription'));
const AiModelSettings = lazy(() => import('pages/settings/AiModel'));
const TeamSettings = lazy(() => import('pages/settings/Team'));
const OAuthSuccess = lazy(() => import('pages/authentication/OAuthSuccess'));
const InviteAccept = lazy(() => import('pages/team/InviteAccept'));
const Notification = lazy(() => import('pages/notification'));
const PurchaseHistory = lazy(() => import('pages/settings/PurchaseHistory'));
const SessionHistory = lazy(() => import('pages/settings/SessionHistory'));

const routes = [
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      // Landing Page
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/referral',
        element: <Referral />,
      },
       {
        path: '/service',
        element: <Service />,
      },

      // Dashboard Routes (relative children)
      {
        path: '/platform',
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'recent-projects', element: <ProtectedRoute><RecentProjects /></ProtectedRoute> },
          { path: 'simple', element: <ProtectedRoute><SimplePage /></ProtectedRoute> },
          { path: 'subscription', element: <Subscription /> },
          { path: 'team', element: <ProtectedRoute><Team /></ProtectedRoute> },
          { path: 'team/invite/accept/:token', element: <ProtectedRoute><InviteAccept /></ProtectedRoute> },
          {
            path: 'settings',
            element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
            children: [
              { index: true, element: <Profile /> },
              { path: 'profile', element: <Profile /> },
              { path: 'account', element: <Account /> },
              { path: 'security', element: <Security /> },
              { path: 'login', element: <LoginSettings /> },
              { path: 'subscription', element: <SubscriptionSettings /> },
              { path: 'ai-mode', element: <AiModelSettings /> },
              { path: 'team', element: <Team /> },
              { path: 'purchase-history', element: <PurchaseHistory /> },
            ],
          },
          { path: 'scan', element: <ScanPage /> },
          { path: 'preview/:id', element: <ProtectedRoute><PreviewPage /></ProtectedRoute> },
          { path: 'splat-viewer/:id', element: <ProtectedRoute><SplatViewer /></ProtectedRoute> },
          { path: 'api-sdk', element: <ApiSdkComingSoon /> },
          { path: 'notification', element: <ProtectedRoute><Notification /></ProtectedRoute> },
          { path: 'support', element: <Support /> },
          { path: 'session-history', element: <ProtectedRoute><SessionHistory /></ProtectedRoute> },
        ],
      },

      // Other Routes
      { path: '/platform/subscription/card', element: <CardPayment /> },
      { path: '/login/success', element: <OAuthSuccess /> },

      // Auth Routes
      {
        path: '/signin',
        element: <AuthLayout><SignIn /></AuthLayout>,
      },
      {
        path: '/signup',
        element: <AuthLayout><SignUp /></AuthLayout>,
      },
      { path: '/reset-password', element: <ResetPassword /> },

      // 404 Page
      { path: '*', element: <Error404 /> },
    ],
  },
];

const router = createBrowserRouter(routes);
export default router;
