import { graphql } from 'gatsby';
import type { BlogQuery } from '../__generated__/types';
import Blog from './blog';

export type Props = {
  data: BlogQuery;
  pageContext: { tag: string };
};

export const BlogTag = ({ data, pageContext: { tag } }: Props) => {
  return <Blog data={data} title={`Tag: ${tag}`} />;
};

export const BlogTagPosts = graphql`
  query BlogTag($tag: String!) {
    allFile(
      filter: {
        sourceInstanceName: { eq: "blog" }
        ext: {}
        extension: { eq: "mdx" }
        childMdx: { frontmatter: { tags: { in: [$tag] } } }
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

export default BlogTag;
