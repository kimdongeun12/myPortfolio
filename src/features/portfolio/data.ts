// ------------------------------------------------------------
// 포트폴리오 데이터 (목록 /portfolio, 상세 /portfolio/[id])
// ------------------------------------------------------------

export type PortfolioSection = {
  heading?: string;    // 문단 제목 (없으면 이전 문단에 이어지는 본문)
  paragraphs: string[];
};

export type PortfolioProject = {
  id: string;          // URL에 쓰이는 값 (/portfolio/[id])
  title: string;
  summary: string;     // 카드에 보이는 짧은 설명
  pinned?: boolean;    // 상단 Pinned 영역에 노출
  role: string;
  period: string;
  stack: string[];
  description: string; // 상세 왼쪽의 프로젝트 설명
  thumbnail?: string;  // 이미지 경로 (없으면 빈 이미지 영역)
  sections: PortfolioSection[];
};

// 시안용 임시 문구 (실제 내용으로 교체 예정)
const SUMMARY =
  '각 프로젝트 설명은 3줄정도를 기입하려고 노력 합시다.각 프로젝트 설명은 3줄정도를 기입하려고 노력 합시다.각 프로젝트 설명은 3줄정도를 기입하려고 노력 합시다.각 프로젝트 설명은 3줄';
const PARAGRAPH = `${SUMMARY}${SUMMARY}${SUMMARY}`;
const STACK = ['Vue', 'React', 'Next', 'Javascript', 'TypeScript', 'Scss', 'Vuetify'];

const sample = (id: string, pinned = false): PortfolioProject => ({
  id,
  title: '프로젝트명',
  summary: SUMMARY,
  pinned,
  role: 'Front-end',
  period: '2025.01 - 현재',
  stack: STACK,
  description: `${SUMMARY}${SUMMARY}`,
  sections: [
    { heading: '문단', paragraphs: [PARAGRAPH, PARAGRAPH] },
  ],
});

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  sample('pinned-1', true),
  sample('pinned-2', true),
  sample('other-1'),
  sample('other-2'),
  sample('other-3'),
];

export const getPortfolioProject = (id: string) =>
  PORTFOLIO_PROJECTS.find((project) => project.id === id);
