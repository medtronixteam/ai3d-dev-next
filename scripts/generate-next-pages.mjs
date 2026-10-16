import fs from 'fs';
import path from 'path';

const root = process.cwd();

const viewPage = (importPath) => `'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const View = dynamic(() => import('${importPath}'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function Page() {
  return <View />;
}
`;

const protectedPage = (importPath) => `'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const Guard = dynamic(() => import('components/ProtectedRoute'), { ssr: false });
const View = dynamic(() => import('${importPath}'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function Page() {
  return (
    <Guard>
      <View />
    </Guard>
  );
}
`;

const authPage = (importPath) => `'use client';

import dynamic from 'next/dynamic';
import Splash from 'components/loader/Splash';

const AuthLayout = dynamic(() => import('layouts/auth-layout'), { ssr: false });
const View = dynamic(() => import('${importPath}'), {
  ssr: false,
  loading: () => <Splash />,
});

export default function Page() {
  return (
    <AuthLayout>
      <View />
    </AuthLayout>
  );
}
`;

const routes = [
  ['app/page.js', 'pages/LandingPage'],
  ['app/about-us/page.js', 'pages/AboutUs'],
  ['app/contributor/program/page.js', 'pages/ContributorPage/ContributorLandingPage'],
  ['app/contributor-getstarted/page.js', 'pages/ContributorPage/GetStartedPage'],
  ['app/referral/page.js', 'pages/referral'],
  ['app/service/page.js', 'pages/Service'],
  ['app/book-demo/page.js', 'pages/Service/BookDemo'],
  ['app/student-program/page.js', 'pages/inquiry/StudentPage'],
  ['app/render/model/[id]/page.js', 'pages/preview/NewModel'],
  ['app/render/btn/page.js', 'pages/preview/OpenModelButton'],
  ['app/terms-conditions/page.js', 'components/service/TermsConditions'],
  ['app/cookie-policy/page.js', 'pages/CookiePolicy'],
  ['app/model/error/page/page.js', 'pages/preview/NewModelErrorPage'],
  ['app/login/success/page.js', 'pages/authentication/OAuthSuccess'],
  ['app/subscription/success/page.js', 'pages/subscription/Success'],
  ['app/reset-password/page.js', 'pages/authentication/ResetPassword'],
  ['app/3dio/subscription/card/page.js', 'pages/subscription/CardPayment'],
  ['app/3dio/public/[slug]/page.js', 'pages/public/PublicProjectPage'],
  ['app/(app-shell)/public/project/[slug]/page.js', 'pages/scan/ScanNewPage'],
  ['app/(app-shell)/project/[slug]/page.js', 'pages/scan/ScanNewPage'],
  ['app/(app-shell)/3dio/subscription/page.js', 'pages/subscription'],
  ['app/(app-shell)/3dio/enterprise/page.js', 'pages/inquiry/EnterprisePage'],
  ['app/(app-shell)/3dio/scan/page.js', 'pages/scan'],
  ['app/(app-shell)/3dio/model/view/page.js', 'pages/scan/ModelView'],
  ['app/(app-shell)/3dio/api-sdk/page.js', 'pages/api-sdk'],
  ['app/(app-shell)/3dio/support/page.js', 'pages/support'],
  ['app/(app-shell)/3dio/support-ticket-history/page.js', 'pages/SupportPages/TicketHistory'],
  ['app/(app-shell)/3dio/support-ticket-detail/[id]/page.js', 'pages/SupportPages/SupportTicketDetails'],
  ['app/(app-shell)/3dio/settings/page.js', 'pages/settings/Profile'],
  ['app/(app-shell)/3dio/settings/profile/page.js', 'pages/settings/Profile'],
  ['app/(app-shell)/3dio/settings/account/page.js', 'pages/settings/Account'],
  ['app/(app-shell)/3dio/settings/security/page.js', 'pages/settings/Security'],
  ['app/(app-shell)/3dio/settings/login/page.js', 'pages/settings/Login'],
  ['app/(app-shell)/3dio/settings/subscription/page.js', 'pages/settings/Subscription'],
  ['app/(app-shell)/3dio/settings/ai-mode/page.js', 'pages/settings/AiModel'],
  ['app/(app-shell)/3dio/settings/referal/page.js', 'pages/settings/ReferralPage'],
  ['app/(app-shell)/3dio/settings/project/page.js', 'pages/settings/ReferralPage'],
  ['app/(app-shell)/3dio/settings/aimodal/page.js', 'pages/settings/ReferralPage'],
  ['app/(app-shell)/3dio/settings/purchase-history/page.js', 'pages/settings/PurchaseHistory'],
];

const protectedRoutes = [
  ['app/(app-shell)/3dio/models/page.js', 'pages/dashboard/RecentProjects'],
  ['app/(app-shell)/3dio/workspace/page.js', 'pages/dashboard/RecentProjects'],
  ['app/(app-shell)/3dio/workspace/[workspaceId]/page.js', 'pages/dashboard/RecentProjects'],
  ['app/(app-shell)/3dio/trash/projects/page.js', 'pages/dashboard/TrashProjects'],
  ['app/(app-shell)/3dio/simple/page.js', 'pages/dashboard/SimplePage'],
  ['app/(app-shell)/3dio/team/page.js', 'pages/team'],
  ['app/(app-shell)/3dio/team/invite/accept/[token]/page.js', 'pages/team/InviteAccept'],
  ['app/(app-shell)/3dio/preview/[id]/page.js', 'pages/preview'],
  ['app/(app-shell)/3dio/splat-viewer/[id]/page.js', 'pages/splat-viewer'],
  ['app/(app-shell)/3dio/notification/page.js', 'pages/notification'],
  ['app/(app-shell)/3dio/session-history/page.js', 'pages/settings/SessionHistory'],
  ['app/(app-shell)/3dio/settings/team/page.js', 'pages/team'],
];

const authRoutes = [
  ['app/signin/page.js', 'pages/authentication/SignIn'],
  ['app/signup/page.js', 'pages/authentication/SignUp'],
];

function write(rel, contents) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

routes.forEach(([rel, view]) => write(rel, viewPage(view)));
protectedRoutes.forEach(([rel, view]) => write(rel, protectedPage(view)));
authRoutes.forEach(([rel, view]) => write(rel, authPage(view)));

console.log(`Wrote ${routes.length + protectedRoutes.length + authRoutes.length} Next.js pages`);
