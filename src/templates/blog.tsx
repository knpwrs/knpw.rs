import type { ReactChild } from 'react';
import { graphql } from 'gatsby';
import { BlogPostRow } from '../components/blog/post-row';
import Layout from '../components/layout';
import type { BlogQuery } from '../__generated__/types';

export type Props = {
  data: BlogQuery;
};

export const Blog = ({ data }: Props) => {
  let groupYear: string | null = null;

  return (
    <Layout>
      <ul>
        {data.allFile?.nodes?.flatMap((node) => {
          const res: Array<ReactChild> = [];
          if (!node.childMdx) {
            return res;
          }
          if (node.childMdx.fields?.year !== groupYear) {
            groupYear = node.childMdx.fields?.year;
            res.push(<h2 key={groupYear}>{groupYear}</h2>);
          }
          res.push(<BlogPostRow key={node.id} data={node.childMdx} />);
          return res;
        })}
      </ul>
    </Layout>
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
