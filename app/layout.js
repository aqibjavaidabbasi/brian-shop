import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const HERO = 'https://www.axcelsports.com/cdn/shop/files/Blog_Banner_for_Website_Content.png?v=1';

export const metadata = {
  metadataBase: new URL(SITE),
  openGraph: {
    type: 'website',
    siteName: 'Axcel Sports',
    images: [HERO + '&width=1200'],
  },
  title: 'Axcel Sports | Custom Race Suits & Premium Motorsports Apparel',
  description:
    'Custom and off-the-rack auto, moto and powerboat racing suits, gloves, shoes and accessories from Axcel Sports.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.axcelsports.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
