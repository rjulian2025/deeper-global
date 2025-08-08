import { visit } from 'unist-util-visit';

export default function rehypeNoExternalLinks() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'a') {
        // Keep the children, drop the anchor wrapper
        node.tagName = 'span';
        if (node.properties) {
          delete node.properties.href;
          delete node.properties.target;
          delete node.properties.rel;
        }
      }
    });
  };
}
