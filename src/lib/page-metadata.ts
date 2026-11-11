import type { Metadata } from 'next';

export const SITE_TITLE = '김동은 | 이력서';
export const SITE_DESCRIPTION = '프론트엔드 개발자 김동은의 이력서와 포트폴리오';
export const OG_IMAGE = { url: '/og_image.jpg', width: 2400, height: 1260, alt: SITE_TITLE };

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path: string;
  type?: 'website' | 'article';
};

const toDescription = (text?: string) => {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return SITE_DESCRIPTION;
  return clean.length > 110 ? `${clean.slice(0, 109)}…` : clean;
};

export const pageMetadata = ({ title, description, path, type = 'website' }: PageMetadataOptions): Metadata => {
  const fullTitle = title ? `김동은 | ${title}` : SITE_TITLE;
  const desc = toDescription(description);
  return {
    ...(title && { title }),
    description: desc,
    openGraph: {
      type,
      locale: 'ko_KR',
      url: path,
      siteName: '김동은 포트폴리오',
      title: fullTitle,
      description: desc,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [OG_IMAGE.url],
    },
  };
};
