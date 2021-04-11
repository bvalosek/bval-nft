import { graphql, useStaticQuery } from 'gatsby';

interface Page {
  slug: string;
  title: string;
  subtitle?: string;
  html: string;
  excerpt: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePages = () => {
  const data = useStaticQuery(graphql`
    query {
      pages: allMarkdownRemark(filter: { frontmatter: { slug: { ne: null } } }) {
        nodes {
          frontmatter {
            slug
            title
            subtitle
          }
          html
          excerpt
        }
      }
    }
  `);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pages: Page[] = data.pages.nodes.map((d: any) => {
    return {
      slug: d.frontmatter.slug,
      title: d.frontmatter.title,
      subtitle: d.frontmatter.subtitle ?? undefined,
      html: d.html,
      excerpt: d.excerpt,
    };
  });

  const getPage = (slug: string): Page => {
    const page = pages.find((p) => p.slug === slug);
    if (!page) {
      throw new Error(`page not found: ${slug}`);
    }
    return page;
  };

  return { pages, getPage };
};
