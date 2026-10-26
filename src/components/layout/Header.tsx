import Link from 'next/link';

export default function Header() {
  return (
    <div className="header-wrap kodchasan">
      <nav className="header-inner" aria-label="주요 메뉴">
        <Link href="/">Profile</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/blog">Blog</Link>
        <span className="header-divider" aria-hidden="true">|</span>
        <Link href="/guest">Guest</Link>
      </nav>
    </div>
  );
}
