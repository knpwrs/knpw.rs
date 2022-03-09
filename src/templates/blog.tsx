import { graphql } from 'gatsby';
import { BlogPostRow } from '../components/blog/post-row';
import type { BlogQuery } from '../__generated__/types';

export type Props = {
  data: BlogQuery;
};

export const Blog = ({ data }: Props) => {
  return (
    <ul>
      {data.allFile?.nodes?.map((node) =>
        node.childMdx ? (
          <BlogPostRow key={node.id} data={node.childMdx} />
        ) : null,
      )}
    </ul>
  );
};

export const BlogPosts = graphql`
  query Blog {
    allFile(
      filter: {
        sourceInstanceName: { eq: "blog" }
        ext: {}
        extension: { eq: "mdx" }
      }
      sort: { fields: childrenMdx___fields___date, order: DESC }
    ) {
      nodes {
        id
        childMdx {
          ...BlogPostRowInfo
        }
      }
    }
  }
`;

export default Blog;
