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
import ReferralPage from '../pages/settings/ReferralPage';
import { Navigate } from 'react-router-dom';
import ContributorLandingPage from '../pages/ContributorPage/ContributorLandingPage';
import GetStartedPage from '../pages/ContributorPage/GetStartedPage';
import TicketHistory from '../pages/SupportPages/TicketHistory';
import SupportTicketDetails from '../pages/SupportPages/SupportTicketDetails';
import NewModel from '../pages/preview/NewModel';
import NewModelErrorPage from '../pages/preview/NewModelErrorPage';
import TrashProjects from '../pages/dashboard/TrashProjects';
import OpenModelButton from '../pages/preview/OpenModelButton';
import BookDemo from '../pages/Service/BookDemo';
import TermsConditions from '../components/service/TermsConditions';

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
const SubscriptionSuccess = lazy(() => import('pages/subscription/Success'));
const Team = lazy(() => import('pages/team'));
const ScanPage = lazy(() => import('../pages/scan'));
const ScanNewPage = lazy(() => import('../pages/scan/ScanNewPage'));
const ModelView = lazy(() => import('../pages/scan/ModelView'));
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
const ServicePage = lazy(() => import('pages/Service/ServicePage'))

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
        path: '/contributor/program',
        element: <ContributorLandingPage />,
      },
      {
        path: '/contributor-getstarted',
        element: <GetStartedPage />,
      },
      {
        path: '/referral',
        element: <Referral />,
      },
      {
        path: '/service',
        element: <Service />,
      },
      {
        path: '/book-demo',
        element: <BookDemo />,
      },
      {
        path: '/render/model/:id',
        element: <NewModel />,
      },
      {
        path: '/render/btn',
        element: <OpenModelButton />,
      },
      {
        path: '/terms-conditions',
        element: <TermsConditions />,
      },
      {
        path: '/services',
        element: <ServicePage />,
      },
      {
        path: '/model/error/page',
        element: <NewModelErrorPage />,
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
          {
            path: 'recent-projects',
            element: (
              <ProtectedRoute>
                <RecentProjects />
              </ProtectedRoute>
            ),
          },
          {
            path: '/platform/trash/projects',
            element: (
              <ProtectedRoute>
                <TrashProjects />
              </ProtectedRoute>
            ),
          },
          {
            path: 'simple',
            element: (
              <ProtectedRoute>
                <SimplePage />
              </ProtectedRoute>
            ),
          },
          { path: 'subscription', element: <Subscription /> },
          {
            path: 'team',
            element: (
              <ProtectedRoute>
                <Team />
              </ProtectedRoute>
            ),
          },
          {
            path: 'team/invite/accept/:token',
            element: (
              <ProtectedRoute>
                <InviteAccept />
              </ProtectedRoute>
            ),
          },
          {
            path: 'settings',
            element: (
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            ),
            children: [
              { index: true, element: <Profile /> },
              { path: 'profile', element: <Profile /> },
              { path: 'account', element: <Account /> },
              { path: 'security', element: <Security /> },
              { path: 'login', element: <LoginSettings /> },
              { path: 'subscription', element: <SubscriptionSettings /> },
              { path: 'ai-mode', element: <AiModelSettings /> },
              { path: 'team', element: <Team /> },
              { path: 'referal', element: <ReferralPage /> },
              { path: 'project', element: <ReferralPage /> },
              { path: 'aimodal', element: <ReferralPage /> },
              { path: 'purchase-history', element: <PurchaseHistory /> },
            ],
          },
          { path: 'scan', element: <ScanPage /> },
          { path: 'new/scan', element: <ScanNewPage /> },
          { path: 'model/view', element: <ModelView /> },
          {
            path: 'preview/:id',
            element: (
              <ProtectedRoute>
                <PreviewPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'splat-viewer/:id',
            element: (
              <ProtectedRoute>
                <SplatViewer />
              </ProtectedRoute>
            ),
          },
          { path: 'api-sdk', element: <ApiSdkComingSoon /> },
          {
            path: 'notification',
            element: (
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            ),
          },
          { path: 'support', element: <Support /> },
          { path: 'support-ticket-history', element: <TicketHistory /> },
          { path: 'support-ticket-detail/:id', element: <SupportTicketDetails /> },
          {
            path: 'session-history',
            element: (
              <ProtectedRoute>
                <SessionHistory />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Other Routes
      { path: '/platform/subscription/card', element: <CardPayment /> },
      { path: '/login/success', element: <OAuthSuccess /> },
      { path: '/subscription/success', element: <SubscriptionSuccess /> },
      {
        path: '/subscription/cancelled',
        element: <Navigate to="/platform/settings/subscription" replace />,
      },

      // Auth Routes
      {
        path: '/signin',
        element: (
          <AuthLayout>
            <SignIn />
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout>
            <SignUp />
          </AuthLayout>
        ),
      },
      { path: '/reset-password', element: <ResetPassword /> },

      // 404 Page
      { path: '*', element: <Error404 /> },
    ],
  },
];

const router = createBrowserRouter(routes);
export default router;
