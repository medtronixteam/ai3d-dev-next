import '../src/index.css';
import '../src/styles/landing-critical.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'simplebar-react/dist/simplebar.min.css';
export const metadata = {
  metadataBase: new URL('https://ai3dscanning.com'),
  title: {
    default: '3DIO AI | AI-Powered 3D Asset Generation',
    template: '%s | 3DIO AI',
  },
  description: 'The AI infrastructure layer for 3D creation. Generate production-ready 3D assets in a minute',
  keywords: [
    '3DIO AI',
    '3D Asset Generation',
    'AI 3D Model Generation',
    '3D Scanning',
    'High Fidelity 3D Models',
  ],
  authors: [{ name: 'AI 3D Scanning Solutions Inc.' }],
  robots: { index: true, follow: true },
  icons: { icon: '/logo.png' },
  openGraph: {
    type: 'website',
    url: 'https://ai3dscanning.com/',
    title: '3DIO AI | AI-Powered 3D Asset Generation',
    description: 'Transform physical reality into high-fidelity digital assets with state-of-the-art AI precision.',
    images: ['https://ai3dscanning.com/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3DIO AI | AI-Powered 3D Asset Generation',
    description: 'Transform physical reality into high-fidelity digital assets with state-of-the-art AI precision.',
    images: ['https://ai3dscanning.com/logo.png'],
  },
};

const themeScript = `
(function () {
  try {
    var theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Manrope:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11.2.10/swiper-bundle.min.css" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <script defer src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/swiper@11.2.10/swiper-bundle.min.js" />
        <script
          defer
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y7DNQYRG5M" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Y7DNQYRG5M');`,
          }}
        />
      </body>
    </html>
  );
}
