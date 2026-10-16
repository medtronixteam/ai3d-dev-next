import ResetPassword from 'pages/authentication/ResetPassword';
import { pageMeta } from '../../seo';

export const metadata = {
  ...pageMeta({
    title: 'Forgot Password | 3DIO AI',
    description: 'Reset your 3DIO AI password.',
    path: '/reset-password',
    keywords: ['Forgot Password', 'Reset Password', '3DIO AI'],
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ResetPassword />;
}
