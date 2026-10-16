import AuthLayout from 'layouts/auth-layout';
import SignIn from 'pages/authentication/SignIn';
import { pageMeta } from '../../seo';

export const metadata = {
  ...pageMeta({
    title: 'Sign in | 3DIO AI',
    description: 'Sign in to 3DIO AI. New users can create an account, or continue with Google or Facebook.',
    path: '/signin',
    keywords: ['Sign in', '3DIO AI', 'Create an account', 'Continue with Google', 'Continue with Facebook'],
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}
