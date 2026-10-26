'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type SlideButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** prev: 이전(btn-prev), next: 다음(btn-next) */
  direction: 'prev' | 'next';
};

/**
 * 슬라이드 이전/다음 버튼 (btn-prev, btn-next)
 * - ref를 넘길 수 있어 Swiper navigation의 prevEl/nextEl로 바로 연결 가능
 * - Swiper가 끝에 닿으면 붙이는 .swiper-button-disabled 상태 스타일 포함 (default.scss)
 */
const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ direction, className, ...rest }, ref) => {
    const isPrev = direction === 'prev';

    return (
      <button
        ref={ref}
        type="button"
        className={clsx(isPrev ? 'btn-prev' : 'btn-next', className)}
        aria-label={isPrev ? '이전 슬라이드' : '다음 슬라이드'}
        {...rest}
      >
        {isPrev ? <FiChevronLeft aria-hidden /> : <FiChevronRight aria-hidden />}
      </button>
    );
  },
);

SlideButton.displayName = 'SlideButton';

export default SlideButton;
