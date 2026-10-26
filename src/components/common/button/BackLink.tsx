import Link from 'next/link';
import clsx from 'clsx';
import { FiArrowLeft } from 'react-icons/fi';

type BackLinkProps = {
  href: string;
  label?: string; // 스크린리더용 이름
  className?: string;
};

/** 원형 뒤로가기 버튼 (스타일은 default.scss의 .btn-back) */
export default function BackLink({ href, label = '목록으로', className }: BackLinkProps) {
  return (
    <Link href={href} className={clsx('btn-back', className)} aria-label={label}>
      <FiArrowLeft aria-hidden />
    </Link>
  );
}
