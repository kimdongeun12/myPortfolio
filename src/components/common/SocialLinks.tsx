import Link from 'next/link';
import type { IconType } from 'react-icons';
import { BsFillBookFill, BsFillEnvelopeHeartFill, BsGithub } from 'react-icons/bs';

import profile from '@/data/profile';

type SocialLink = {
  label: string;     // 스크린리더용 이름 (아이콘만 있는 링크라 필요)
  href: string;
  icon: IconType;
  external?: boolean; // 새 창으로 열기
};

const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: profile.links.github, icon: BsGithub, external: true },
  { label: '블로그(velog)', href: profile.links.blog, icon: BsFillBookFill, external: false },
  { label: '이메일 보내기', href: `mailto:${profile.email}`, icon: BsFillEnvelopeHeartFill },
];

/**
 * GitHub · 블로그 · 메일 아이콘 링크
 * - 링크는 감싸는 요소의 바로 아래 자식(a)으로 렌더링 → 사용하는 곳의 className으로 스타일 지정
 *   (비주얼: .link-wrap, 연락처: .contact-links)
 */
export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map(({ label, href, icon: Icon, external }) => (
        <Link
          key={label}
          href={href}
          aria-label={label}
          {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          <Icon aria-hidden />
        </Link>
      ))}
    </div>
  );
}
