import iconSlugs from '@/data/skill-icons.json';

export const SKILL_ORDER = [
  'Vue', 'React', 'Next', 'Javascript', 'TypeScript', 'Scss', 'Vuetify', 'Spring',
  'MySQL', 'AWS', 'Jenkins', 'Vite', 'Bitbucket', 'Git', 'Figma', 'Webpack',
];

const SKILL_LABELS: Record<string, string> = {
  Scss: 'SCSS',
  Javascript: 'JavaScript',
  Next: 'Next.js',
  Spring: 'Spring Boot',
};

const ICON_ALIASES: Record<string, string> = {
  scss: 'sass',
  aws: 'amazonwebservices',
  apolloclient: 'apollographql',
  springboot: 'spring',
  vite: 'vitejs',
};

const available = new Set<string>(iconSlugs);

export const formatSkill = (skill: string) => SKILL_LABELS[skill] ?? skill;

export const skillIcon = (skill: string) => {
  const key = skill.toLowerCase().replace(/\.js$/, 'js').replace(/[^a-z0-9]/g, '');
  const slug = [ICON_ALIASES[key], key, `${key}js`].find((name) => name && available.has(name));
  return slug ? `/images/skills/${slug}.svg` : undefined;
};
