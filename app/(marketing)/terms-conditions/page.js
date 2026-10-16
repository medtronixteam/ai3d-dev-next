import TermsConditions from 'components/service/TermsConditions';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'Terms and Conditions | 3DIO AI',
  description:
    'Terms for using 3DIO AI, operated by AI 3D Scanning Solutions Inc., including accounts, uploaded content, generated 3D assets, plans, and acceptable use.',
  path: '/terms-conditions',
  keywords: [
    'Terms and Conditions',
    '3DIO AI',
    'AI 3D Scanning Solutions Inc.',
    'accounts',
    'generated 3D assets',
    'acceptable use',
  ],
});

export default function Page() {
  return <TermsConditions />;
}
