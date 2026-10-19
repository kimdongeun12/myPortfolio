/**
 * 모든 배경(Background) 컴포넌트가 공유하는 공통 props 타입.
 * 앞으로 추가될 Background02 ~ Background05도 동일한 인터페이스를 구현합니다.
 */
export interface BackgroundProps {
  /** 애니메이션 속도 배율 (기본값 1) */
  speed?: number;
  /** 최상위 wrapper(div)에 추가로 적용할 클래스명 */
  className?: string;
}
