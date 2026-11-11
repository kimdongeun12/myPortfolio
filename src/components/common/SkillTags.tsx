import clsx from 'clsx';

import { SKILL_ICONS, formatSkill } from '@/data/skills';

type SkillTagsProps = {
  skills: string[];
  /** sm: 카드처럼 좁은 곳에 쓰는 작은 크기 */
  size?: 'md' | 'sm';
  className?: string;
};

/**
 * 기술 스택 태그 목록 (아이콘 + 이름), 스타일은 default.scss의 .skill-box
 */
export default function SkillTags({ skills, size = 'md', className }: SkillTagsProps) {
  return (
    <div className={clsx('skill-box', size === 'sm' && 'is-sm', className)}>
      {skills.map((skill) => (
        <span key={skill}>
          {SKILL_ICONS[skill] && (
            // 장식용 아이콘이라 alt는 비움 (이름은 옆 글자로 읽힘)
            // eslint-disable-next-line @next/next/no-img-element
            <img className='skill-icon' src={SKILL_ICONS[skill]} alt='' width={24} height={24} />
          )}
          {formatSkill(skill)}
        </span>
      ))}
    </div>
  );
}
