import ClientShell from '../client-shell';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function ModelLayout({ children }) {
  return <ClientShell>{children}</ClientShell>;
}
