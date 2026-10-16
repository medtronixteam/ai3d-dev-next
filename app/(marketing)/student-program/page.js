import StudentPage from 'pages/inquiry/StudentPage';
import { pageMeta } from '../../seo';

export const metadata = pageMeta({
  title: 'Student Program | Apply for Academic Access',
  description:
    'Share your university details and apply for student use of the platform. For academic projects, research, and thesis work, using a university email and student ID.',
  path: '/student-program',
  keywords: [
    'Student Program',
    'academic access',
    'university email',
    'academic projects',
    'research and thesis',
  ],
});

export default function Page() {
  return <StudentPage />;
}
