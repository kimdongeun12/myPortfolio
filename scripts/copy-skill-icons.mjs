import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const iconsDir = join(dirname(require.resolve('devicon/package.json')), 'icons');
const outDir = join(process.cwd(), 'public/images/skills');
const listFile = join(process.cwd(), 'src/data/skill-icons.json');

const DARK = 0.12;
const LIGHT = 0.6;
const HEX = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi;

const luminance = (hex) => {
  const full = hex.length === 4 ? hex.replace(/[0-9a-f]/gi, (c) => c + c) : hex;
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const fitDarkBackground = (svg) => {
  if (!/fill/i.test(svg)) return svg.replace('<svg', '<svg fill="#fff"');
  const colors = svg.match(HEX) ?? [];
  if (colors.some((c) => luminance(c) > LIGHT)) return svg;
  return svg.replace(HEX, (c) => (luminance(c) < DARK ? '#fff' : c));
};

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const slugs = [];
for (const slug of readdirSync(iconsDir)) {
  const files = readdirSync(join(iconsDir, slug));
  const file = [`${slug}-original.svg`, `${slug}-plain.svg`].find((name) => files.includes(name));
  if (!file) continue;
  const svg = readFileSync(join(iconsDir, slug, file), 'utf8');
  writeFileSync(join(outDir, `${slug}.svg`), fitDarkBackground(svg));
  slugs.push(slug);
}

writeFileSync(listFile, `${JSON.stringify(slugs.sort())}\n`);
console.log(`skill icons: ${slugs.length}`);
