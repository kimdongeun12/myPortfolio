// 기술 스택 아이콘 (public/images/skills), 여기에 없는 항목은 글자만 표시
// 프로필 SKILLS, 포트폴리오 카드·상세 등 여러 곳에서 공용으로 사용
export const SKILL_ICONS: Record<string, string> = {
  Vue: '/images/skills/vue.svg',
  React: '/images/skills/react.svg',
  Next: '/images/skills/next.svg',
  Javascript: '/images/skills/javascript.svg',
  TypeScript: '/images/skills/typescript.svg',
  Scss: '/images/skills/scss.svg',
  Vuetify: '/images/skills/vuetify.svg',
  Spring: '/images/skills/spring.svg',
  MySQL: '/images/skills/mysql.svg',
  AWS: '/images/skills/aws.svg',
  Jenkins: '/images/skills/jenkins.svg',
  Vite: '/images/skills/vite.svg',
  Bitbucket: '/images/skills/bitbucket.svg',
  Git: '/images/skills/git.svg',
  Figma: '/images/skills/figma.svg',
  Webpack: '/images/skills/webpack.svg',
};

const SKILL_LABELS: Record<string, string> = {
  Scss: 'SCSS',
  Javascript: 'JavaScript',
  Next: 'Next.js',
  Spring: 'Spring Boot',
};

export const formatSkill = (skill: string) => SKILL_LABELS[skill] ?? skill;
