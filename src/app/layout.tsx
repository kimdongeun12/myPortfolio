import React from 'react';


import '/public/styles/reset.scss';
import '/public/styles/default.scss';

// component
import Visual from './Visual';

export const metadata = {
  title: {
    template: '김동은 | %s',
    default: '김동은 | 이력서',
  },
  description: '김동은 이력서',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
          <div id="wrap">
            <Visual />
            <div className="contents-wrap">{children}</div>
          </div>
      </body>
    </html>
  );
}