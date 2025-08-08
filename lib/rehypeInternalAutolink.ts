import { visit, SKIP } from 'unist-util-visit';
import { TERM_LINKS, CANON } from './internalLinkPolicy';

const MAX_LINKS_PER_DOC = 4;

export default function rehypeInternalAutolink() {
  return (tree: any) => {
    let count = 0;
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (count >= MAX_LINKS_PER_DOC || !node.value || index === undefined) return;
      let text = node.value as string;

      for (const [term, path] of Object.entries(TERM_LINKS)) {
        if (count >= MAX_LINKS_PER_DOC) break;
        const re = new RegExp(`\\b(${term})\\b`, 'i');
        if (re.test(text)) {
          const parts = text.split(re);
          const children = [];
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
              if (parts[i]) children.push({ type: 'text', value: parts[i] });
            } else {
              children.push({
                type: 'element',
                tagName: 'a',
                properties: { href: `${CANON}${path}` },
                children: [{ type: 'text', value: parts[i] }],
              });
              count++;
            }
          }
          parent.children.splice(index, 1, ...children);
          return [SKIP, index + children.length];
        }
      }
    });
  };
}
