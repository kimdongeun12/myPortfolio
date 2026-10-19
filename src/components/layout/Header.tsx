import Link from 'next/link';

export default function Header() {
  return (
    <div className="header-wrap kodchasan">
      <div className="header-inner">
        <Link href="/">Profile</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/portfolio">Portfolio</Link>
      </div>
    </div>
  );
}
