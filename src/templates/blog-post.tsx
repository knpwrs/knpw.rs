import { graphql, Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/layout';
import type { BlogPostQuery } from '../__generated__/types';

export type Props = {
  data: BlogPostQuery;
};

const BlogPostTemplate = ({ data }: Props) => {
  const { body } = data.post?.childMdx ?? {};
  const previous = data?.previousPost?.childMdx ?? {};
  const next = data?.nextPost?.childMdx ?? {};

  if (!body) return null;

  return (
    <Layout>
      <article>
        <h1>{data.post?.childMdx?.frontmatter?.title}</h1>
        {previous.fields?.slug ? (
          <h2>
            Previous:
            <Link to={`/blog/${previous.fields?.slug}`}>
              {previous.frontmatter?.title}
            </Link>
          </h2>
        ) : null}
        {next.fields?.slug ? (
          <h2>
            Next:
            <Link to={`/blog/${next.fields?.slug}`}>
              {next.frontmatter?.title}
            </Link>
          </h2>
        ) : null}
        <MDXRenderer>{body}</MDXRenderer>
      </article>
    </Layout>
  );
};

export const BlogPostById = graphql`
  query BlogPost($id: String!, $previousPostId: String, $nextPostId: String) {
    post: file(id: { eq: $id }) {
      childMdx {
        body
        frontmatter {
          title
          tags
        }
        fields {
          date(formatString: "MMMM Do, YYYY")
          shortDate: date(formatString: "DD MMM")
        }
      }
    }
    previousPost: file(id: { eq: $previousPostId }) {
      childMdx {
        frontmatter {
          title
        }
        fields {
          slug
        }
      }
    }
    nextPost: file(id: { eq: $nextPostId }) {
      childMdx {
        frontmatter {
          title
        }
        fields {
          slug
        }
      }
    }
  }
`;

export default BlogPostTemplate;
