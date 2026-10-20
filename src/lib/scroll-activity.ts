/**
 * 스크롤 중인지 감지하는 공용 유틸
 * - 스크롤이 시작되면 true, 마지막 스크롤 이벤트 후 IDLE_MS 동안 조용하면 false
 * - 스크롤 중에는 html에 .is-scrolling 클래스가 붙음 (CSS 애니메이션 일시정지용)
 * - 캔버스·WebGL처럼 매 프레임 다시 그리는 무거운 연출을 스크롤 중에 잠시 멈추는 데 사용
 */
type Listener = (scrolling: boolean) => void;

const IDLE_MS = 150;
const listeners = new Set<Listener>();
let scrolling = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let bound = false;

function setScrolling(next: boolean) {
  if (scrolling === next) return;
  scrolling = next;
  document.documentElement.classList.toggle('is-scrolling', next);
  listeners.forEach((listener) => listener(next));
}

function onScroll() {
  setScrolling(true);
  clearTimeout(timer);
  timer = setTimeout(() => setScrolling(false), IDLE_MS);
}

function bind() {
  if (bound || typeof window === 'undefined') return;
  window.addEventListener('scroll', onScroll, { passive: true });
  bound = true;
}

export function isScrolling() {
  bind();
  return scrolling;
}

export function subscribeScrollActivity(listener: Listener) {
  bind();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
