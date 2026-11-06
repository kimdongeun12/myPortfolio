type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

export type TocItem = { id: string; label: string };

const TOC_TAGS = new Set(['h2', 'h3']);

const headingId = (index: number) => `heading-${index + 1}`;

export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    let index = 0;
    const visit = (node: HastNode) => {
      if (node.type === 'element' && node.tagName && TOC_TAGS.has(node.tagName)) {
        node.properties = { ...node.properties, id: headingId(index) };
        index += 1;
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

const toPlainText = (text: string) =>
  text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim();

export function extractToc(source: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of source.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) items.push({ id: headingId(items.length), label: toPlainText(match[2]) });
  }
  return items;
}
