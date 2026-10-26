'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

type TocItem = { id: string; label: string };

/**
 * 목차: 클릭하면 해당 문단으로 이동, 스크롤 위치에 맞춰 현재 문단을 강조
 */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;

    // 화면 위에서 30% 지점보다 위로 올라간 마지막 문단을 현재 문단으로
    // (스크롤을 빠르게 내리거나 맨 아래로 바로 가도 정확하게 맞음)
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = targets[0].id;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  return (
    <nav className='toc' aria-label='목차'>
      <p className='sidebar-label'>목차</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={clsx(item.id === activeId && 'is-active')}
              aria-current={item.id === activeId ? 'location' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
