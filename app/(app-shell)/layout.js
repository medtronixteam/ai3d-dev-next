import AppShell from './shell';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AppShellLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
