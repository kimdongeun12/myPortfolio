export type AboutItem = { title: string; desc: string };
export type Experience = { id: number; startDate: string; endDate: string; name: string; job: string; info: string };
export type SkillGroup = { id: number; name: string; desc: string; stack: string[] };
export type Project = {
  id: number;
  title: string;
  subtitle: string;
  thumbnail: string;
  roles: { label: string; value: string }[];
  href: string;
};
export type Post = { title: string; date: string; href: string };
export type PostBoard = { title: string; borderVariant?: 'border-02'; href: string; posts: Post[] };

export type ProfileData = {
  experiences: Experience[];
  skillGroups: SkillGroup[];
  projects: Project[];
  postBoards: PostBoard[];
};

export const ABOUT_ITEMS: AboutItem[] = [
  { title: '사용자 경험', desc: '사용자가 자연스럽게 서비스를 이용할 수 있는 인터페이스와 흐름을 고민합니다.' },
  { title: '구조와 재사용', desc: '반복되는 UI와 로직을 정리해 유지보수하기 좋은 구조를 만들어 갑니다.' },
  { title: '안정적인 서비스', desc: '개발과 운영 경험을 바탕으로 안정적으로 지속될 수 있는 서비스를 고민합니다.' },
  { title: '함께 만드는 개발', desc: '다양한 직군과 소통하며 더 나은 해결책을 함께 찾아갑니다.' },
];
