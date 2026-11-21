import Link from 'next/link';
import { CATEGORIES, STORE_URL } from '@/lib/catalog';

const LOGO = 'https://www.axcelsports.com/cdn/shop/files/Untitled_design_51.png?width=400';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="Axcel Sports home">
          <img src={LOGO} alt="Axcel Sports" width="200" height="98" />
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </nav>
        <a className="cart-link" href={`${STORE_URL}/cart`} aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 7h12l-1 13H7L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
        </a>
      </div>
    </header>
  );
}
