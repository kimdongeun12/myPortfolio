// ------------------------------------------------------------
// 프로필 페이지 데이터 (화면 마크업과 분리)
// ------------------------------------------------------------

export type AboutItem = { title: string; desc: string };
export type Experience = { startDate: string; endDate: string; name: string; job: string; info: string };
export type SkillGroup = { name: string; desc: string; stack: string[] };
export type Project = {
  title: string;
  subtitle: string;
  roles: { label: string; value: string }[];
  href: string;
};
export type Post = { title: string; date: string; href: string };
export type PostBoard = { title: string; borderVariant?: 'border-02'; posts: Post[] };

export const ABOUT_ITEMS: AboutItem[] = [
  { title: '사용자 경험', desc: '사용자가 자연스럽게 서비스를 이용할 수 있는 인터페이스와 흐름을 고민합니다.' },
  { title: '구조와 재사용', desc: '반복되는 UI와 로직을 정리해 유지보수하기 좋은 구조를 만들어 갑니다.' },
  { title: '안정적인 서비스', desc: '개발과 운영 경험을 바탕으로 안정적으로 지속될 수 있는 서비스를 고민합니다.' },
  { title: '함께 만드는 개발', desc: '다양한 직군과 소통하며 더 나은 해결책을 함께 찾아갑니다.' },
];

export const EXPERIENCES: Experience[] = [
  {
    startDate: '20230621',
    endDate: '재직중',
    name: '(주) 클러쉬 | (전) 디씨온',
    job: 'KB개발담당',
    info: '국민지갑 플랫폼의 프론트엔드 업무를 리딩하며 구조 설계, 공통화, 서비스 개발과 운영을 경험했습니다. SSO 인증, GLN 해외결제, 메인 UI 고도화, 기차예매 개선 등 다양한 금융 서비스를 담당했고, 합병 이후에도 플랫폼 개발과 운영, 재사용 구조 개선을 이어가고 있습니다.',
  },
  {
    startDate: '20230621',
    endDate: '재직중',
    name: '(주) 클러쉬 | (전) 디씨온',
    job: 'KB개발담당',
    info: '국민지갑 플랫폼의 프론트엔드 업무를 리딩하며 구조 설계, 공통화, 서비스 개발과 운영을 경험했습니다. SSO 인증, GLN 해외결제, 메인 UI 고도화, 기차예매 개선 등 다양한 금융 서비스를 담당했고, 합병 이후에도 플랫폼 개발과 운영, 재사용 구조 개선을 이어가고 있습니다.',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  { name: 'Front-end', desc: '설명 작성 예정', stack: ['Vue', 'React', 'Next', 'Javascript', 'TypeScript', 'Scss', 'Vuetify'] },
  { name: 'Back-end', desc: '설명 작성 예정', stack: ['Spring', 'MySQL'] },
  { name: 'Tools', desc: '설명 작성 예정', stack: ['AWS', 'Jenkins', 'Vite', 'Bitbucket', 'Git', 'Figma', 'Webpack'] },
];

export const PROJECTS: Project[] = [
  {
    title: '국민지갑',
    subtitle: '프론트엔드 운영 개발',
    roles: [
      { label: 'ROLE', value: '프론트엔드 운영 및 개발' },
      { label: 'ROLE', value: '프론트엔드 운영 및 개발' },
    ],
    href: '/',
  },
  {
    title: '국민지갑',
    subtitle: '프론트엔드 운영 개발',
    roles: [
      { label: 'ROLE', value: '프론트엔드 운영 및 개발' },
      { label: 'ROLE', value: '프론트엔드 운영 및 개발' },
    ],
    href: '/',
  },
];

export const POST_BOARDS: PostBoard[] = [
  { title: 'Blog', posts: [{ title: '여기에는 명칭', date: '26.10.13', href: '/' }] },
  { title: 'Guest Board', borderVariant: 'border-02', posts: [{ title: '여기에는 명칭', date: '26.10.13', href: '/' }] },
];
