import { graphql } from 'gatsby';
import { BlogPostRow } from '../components/blog/post-row';
import Layout from '../components/layout';
import type { BlogQuery } from '../__generated__/types';

export type Props = {
  data: BlogQuery;
  pageContext: { tag: string };
};

export const Blog = ({ data, pageContext: { tag } }: Props) => {
  return (
    <Layout>
      <h1>Tag: {tag}</h1>
      <h2>{data.allFile?.nodes?.length ?? 0} posts</h2>
      <ul>
        {data.allFile?.nodes?.map((node) =>
          node.childMdx ? (
            <BlogPostRow key={node.id} data={node.childMdx} />
          ) : null,
        )}
      </ul>
    </Layout>
  );
};

export const BlogPosts = graphql`
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

export default Blog;
