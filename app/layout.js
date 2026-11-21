import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Axcel Sports | Custom Race Suits & Premium Motorsports Apparel',
  description:
    'Custom and off-the-rack auto, moto and powerboat racing suits, gloves, shoes and accessories from Axcel Sports.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
