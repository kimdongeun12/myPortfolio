'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tsParticles } from 'tsparticles-engine';

import { subscribeScrollActivity } from '@/lib/scroll-activity';

gsap.registerPlugin(ScrollTrigger);

/**
 * visual 섹션 스크롤 연출 (GSAP ScrollTrigger)
 * - .visual-wrap(250vh)을 지나는 동안 타임라인을 스크롤에 맞춰 재생(scrub)
 * - 원 구멍·링 크기: CSS 변수 --scroll-progress(0 → 1)를 트윈해서 visual.scss의 calc()에 전달
 * - 이름·링크·파티클 확대, 흐려짐: GSAP 트윈
 * - 화면 고정은 CSS position: sticky가 담당 (프로필과 겹치는 레이아웃 유지)
 *
 * @param refreshKey 값이 바뀌면 ScrollTrigger 위치를 다시 계산 (인트로 후 스크롤 잠금 해제 시점 등)
 */
export function useVisualScrollTrigger(
  ref: RefObject<HTMLElement>,
  refreshKey?: unknown,
) {
  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;

    const mm = gsap.matchMedia();

    mm.add(
      // matchMedia는 조건 중 하나라도 맞아야 콜백을 실행하므로, 항상 둘 중 하나는 맞도록 둘 다 지정
      {
        isMotionOk: '(prefers-reduced-motion: no-preference)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        const content = ['.visual-middle > .name-wrap', '.visual-middle > .link-wrap'];

        const middle = wrap.querySelector<HTMLElement>('.visual-middle');
        // 원 안으로 드러날 다음 섹션 (page.tsx에서 <Visual /> 바로 다음의 <Profile />)
        const nextSection = wrap.nextElementSibling as HTMLElement | null;
        // 실제로 옮길 대상: 다음 섹션의 자식 중 position: fixed 배경을 뺀 나머지
        // ※ 섹션 자체에 transform을 주면 안쪽의 fixed 배경(AmbientBackground)이 화면이 아니라
        //   섹션(max-width 1312px, 가운데 정렬) 기준으로 붙어서 왼쪽으로 밀리고 화면을 다 못 채움
        const nextContents = nextSection
          ? Array.from(nextSection.children).filter(
              (el): el is HTMLElement =>
                el instanceof HTMLElement && getComputedStyle(el).position !== 'fixed',
            )
          : [];

        // 계산에 필요한 값 (리사이즈 시 ScrollTrigger refresh 때 다시 측정)
        let ringBase = 1;       // 링 기본 지름(px)
        let maxHole = 1;        // 구멍 최대 반지름(px) = 75vmax
        let revealDistance = 0; // 원이 커지는 스크롤 구간(px) = .visual-wrap 높이 - 화면 높이
        const measure = () => {
          maxHole = Math.max(window.innerWidth, window.innerHeight) * 0.75;
          revealDistance = Math.max(wrap.offsetHeight - window.innerHeight, 0);
          if (middle) ringBase = parseFloat(getComputedStyle(middle, '::before').width) || 1;
        };
        measure();

        // 다음 섹션을 원이 커지는 동안 화면 맨 위에 고정해서, 원 안에 제자리로 보이게 함
        // - 레이아웃상 다음 섹션은 구간 끝(margin-bottom: -100vh 기준)에서 시작하므로
        //   남은 구간만큼 위로 끌어올림: 진행도 0 → -구간 길이, 1 → 0
        // - 끝나면 transform을 지워 원래 레이아웃 그대로 스크롤되게 함
        const updateNextSection = (progress: number) => {
          const transform =
            progress < 1 ? `translate3d(0, ${(-(1 - progress) * revealDistance).toFixed(1)}px, 0)` : '';
          nextContents.forEach((el) => {
            el.style.transform = transform;
          });
        };

        // 구멍이 링보다 커지면 링이 구멍 가장자리를 따라감 (+6px: 테두리가 마스크에 묻히지 않도록)
        const updateRing = (progress: number) => {
          if (!middle) return;
          const scale = Math.max(1, (progress * maxHole * 2 + 6) / ringBase);
          // 커질수록 테두리가 두꺼워지므로 후반(0.5~1)에 서서히 사라지게
          const opacity = gsap.utils.clamp(0, 1, (1 - progress) / 0.5);
          middle.style.setProperty('--ring-scale', scale.toFixed(3));
          middle.style.setProperty('--ring-opacity', opacity.toFixed(3));
        };

        // 파티클 재생 조건: 구간을 다 지나지 않았고(보이는 상태) 스크롤 중이 아닐 때
        // - 다 열린 뒤: 보이지 않는데 계속 그리면 낭비
        // - 스크롤 중: 캔버스 다시 그리기를 멈춰 스크롤 연출에 프레임 양보 (멈추면 마지막 장면 유지)
        let isEnded = false;
        let isUserScrolling = false;
        const syncParticles = () => {
          const playing = !isEnded && !isUserScrolling;
          tsParticles.dom().forEach((container) => (playing ? container.play() : container.pause()));
        };
        const setParticlesPlaying = (playing: boolean) => {
          isEnded = !playing;
          syncParticles();
        };
        const unsubscribeScroll = subscribeScrollActivity((scrolling) => {
          isUserScrolling = scrolling;
          syncParticles();
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',     // .visual-wrap 상단이 화면 상단에 닿을 때 시작
            end: 'bottom bottom', // .visual-wrap 하단이 화면 하단에 닿을 때 끝
            // Lenis가 스크롤 자체를 부드럽게 보간하므로 추가 지연 없이 바로 따라감
            // (0.2 같은 값을 주면 보간이 두 번 겹쳐 연출이 스크롤보다 늦게 따라옴)
            scrub: true,
            onRefresh: () => {
              measure();
              updateLayers(tl.progress());
            },
            // 끝까지 열리면 고정 레이어를 숨겨 아래 섹션 클릭을 막지 않도록 (CSS에서 사용)
            onLeave: () => {
              wrap.setAttribute('data-scroll-end', '');
              setParticlesPlaying(false);
            },
            onEnterBack: () => {
              wrap.removeAttribute('data-scroll-end');
              setParticlesPlaying(true);
            },
          },
          defaults: { duration: 1, ease: 'none' },
          // 타임라인 진행도에 맞춰 링·다음 섹션 위치 갱신
          onUpdate: () => updateLayers(tl.progress()),
        });

        function updateLayers(progress: number) {
          updateRing(progress);
          updateNextSection(progress);
        }
        // 첫 스크롤 전에도 다음 섹션이 제자리(원 아래)에 있도록 바로 한 번 적용
        updateLayers(tl.progress());

        // 원 구멍·링: 0 → 1 (visual.scss에서 --hole, --ring 계산)
        tl.fromTo(wrap, { '--scroll-progress': 0 }, { '--scroll-progress': 1 }, 0);

        // 움직임 줄이기 설정이 아니면 확대 연출
        if (!reduceMotion) {
          tl.to(content, { scale: 1.6 }, 0).to('#tsparticles', { scale: 1.3 }, 0);
        }

        // 이름·링크는 앞부분(1/3)에서 빠르게 사라짐
        tl.to(content, { autoAlpha: 0, duration: 0.33, ease: 'power1.in' }, 0);

        // matchMedia가 되돌릴 때(언마운트 등) 함께 정리
        return () => {
          unsubscribeScroll();
          nextContents.forEach((el) => {
            el.style.transform = '';
          });
          tsParticles.dom().forEach((container) => container.play());
        };
      },
      wrap, // 선택자 범위를 .visual-wrap 안으로 한정
    );

    return () => mm.revert();
  }, [ref]);

  // 인트로가 끝나 스크롤이 풀리는 등 레이아웃이 바뀌면 위치 재계산
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [refreshKey]);
}
