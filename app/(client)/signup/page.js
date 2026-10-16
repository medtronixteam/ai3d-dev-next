import AuthLayout from 'layouts/auth-layout';
import SignUp from 'pages/authentication/SignUp';
import { pageMeta } from '../../seo';

export const metadata = {
  ...pageMeta({
    title: 'Sign up | 3DIO AI',
    description: 'Create a 3DIO AI account.',
    path: '/signup',
    keywords: ['Sign up', '3DIO AI', 'Create an account'],
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}
