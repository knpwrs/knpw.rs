import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { css } from 'linaria';
import Layout from '../components/layout';
import type { PageByIdQuery } from '../__generated__/types';

export type Props = {
  data: PageByIdQuery;
};

const BlogPostTemplate = ({ data }: Props) => {
  const { body } = data.file?.childMdx ?? {};

  if (!body) return null;

  const { title } = data.file?.childMdx?.frontmatter ?? {};

  return (
    <Layout
      title={title}
      className={css`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
        }
      `}
    >
      <MDXRenderer>{body}</MDXRenderer>
    </Layout>
  );
};

export const PageById = graphql`
  query PageById($id: String!) {
    file(id: { eq: $id }) {
      childMdx {
        body
        frontmatter {
          title
        }
      }
    }
  }
`;

export default BlogPostTemplate;
