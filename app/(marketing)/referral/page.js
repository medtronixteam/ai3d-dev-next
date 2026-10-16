import Referral from 'pages/referral';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'Spread the Magic. Stack the Rewards. | 3DIO AI',
  description:
    'Invite your crew, unlock milestones, and climb the leaderboard to earn premium features, merch, and more.',
  path: '/referral',
  keywords: ['referral rewards', 'invite your crew', 'milestones', 'leaderboard', 'premium features'],
});

export default function Page() {
  return <Referral />;
}
