import ClientShell from '../client-shell';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }) {
  return <ClientShell>{children}</ClientShell>;
}
