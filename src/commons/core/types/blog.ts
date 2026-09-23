// 개별 경력 아이템
export interface ExperienceItem {
    category: string;
    name: string;      // 회사명
    team: string;      // 담당 부서
    job: string;       // 담당 직무
    level: string;     // 직급
    startDate: string; // 시작 년월일 (YYYYMMDD 등)
    endDate: string;   // 종료일 or "재직중"
    stack: string[];
    desc: string;      // 상세 설명 (멀티라인 문자열 가능)
  }
  
  // 경력 전체
  export interface Experience {
    title: string;
    items: ExperienceItem[];
  }
  
  // 프로젝트 내 상세 설명
  export interface ProjectInfo {
    title: string;
    desc: string[];
  }
  
  // 프로젝트 아이템
  export interface ProjectItem {
    company: string;
    title: string;
    stack: string[];
    startDate: string;
    endDate: string;
    desc: string;
    info: ProjectInfo[];
  }
  
  // 프로젝트 전체
  export interface Project {
    title: string;
    items: Record<string, ProjectItem>; 
    // key는 category (예: 'dc-on')
  }
  
  // 기술 스택
  export interface Stack {
    title: string;
    items: Record<string, any>; 
    // 아직 정의된 구조가 없으므로 any 또는 필요한 경우 구체적으로 정의
  }
  
  // 교육
  export interface Education {
    title: string;
  }
  
  // 활동
  export interface Activity {
    title: string;
  }
  
  // 최상위 Blog 타입
  export interface Blog {
    experience: Experience;
    project: Project;
    stack: Stack;
    education: Education;
    activity: Activity;
  }