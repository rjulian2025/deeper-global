export const mdxComponents = {
  a: (props: any) => <span>{props.children}</span> // never render as link
};
