import Link from 'next/link';
import clsx from 'clsx';

type TagChipProps = {
  label: string;
  active?: boolean;
  className?: string;
} & (
  | { href: string; onClick?: never }     // 링크로 이동 (예: 상세 → 목록 태그 필터)
  | { href?: never; onClick?: () => void } // 버튼 (예: 목록 안에서 필터 전환)
);

/** "# 태그" 칩 (스타일은 default.scss의 .tag-chip) */
export default function TagChip({ label, active, className, href, onClick }: TagChipProps) {
  const classes = clsx('tag-chip', active && 'is-active', className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        # {label}
      </Link>
    );
  }
  return (
    <button type='button' className={classes} aria-pressed={active} onClick={onClick}>
      # {label}
    </button>
  );
}
