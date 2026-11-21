import Link from 'next/link';
import { CATEGORIES, STORE_URL } from '@/lib/catalog';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Axcel Sports</strong>
          <p>Custom &amp; Off the Rack, Auto, Moto &amp; Powerboat Racing Suits, Accessories and Teamwear.</p>
        </div>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/shop/${c.slug}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
        <p className="footer-note">
          Checkout, payment and order emails run on the official store at{' '}
          <a href={STORE_URL}>axcelsports.com</a>.
        </p>
      </div>
    </footer>
  );
}
