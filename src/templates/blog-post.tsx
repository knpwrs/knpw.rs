import { graphql, Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { styled } from 'linaria/react';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import Layout from '../components/layout';
import { car } from '../util/theme';
import type { BlogPostQuery } from '../__generated__/types';

const MetaContainer = styled.aside`
  display: flex;
  flex-direction: row;
  align-items: center;
  & > svg {
    margin-right: calc(${car('spacing')} / 3);
  }
`;

const MetaMidDot = styled.span`
  margin: 0 calc(${car('spacing')} / 3);
  &::before {
    display: inline;
    content: '\u00b7';
  }
`;

MetaMidDot.defaultProps = { role: 'presentation' };

const OtherPosts = styled.aside`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const OtherPost = styled.div<{ dir: 'prev' | 'next' }>`
  text-align: ${({ dir }) => (dir === 'prev' ? 'left' : 'right')};
  min-width: 45%;
  max-width: 500px;
`;

const OtherPostLabel = styled.h3`
  margin: 0;
`;
const OtherPostTitle = styled.h4`
  margin: 0;
`;

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
        <MetaContainer>
          <FaRegClock /> <span>{data.post?.childMdx?.timeToRead} min</span>
          <MetaMidDot />
          <FaRegCalendarAlt />
          <span>{data.post?.childMdx?.fields?.date}</span>
        </MetaContainer>
        <MDXRenderer>{body}</MDXRenderer>
        <OtherPosts>
          {previous.fields?.slug ? (
            <OtherPost dir="prev">
              <OtherPostLabel>Previous</OtherPostLabel>
              <OtherPostTitle>
                <Link to={`/blog/${previous.fields?.slug}`}>
                  {previous.frontmatter?.title}
                </Link>
              </OtherPostTitle>
            </OtherPost>
          ) : null}
          {next.fields?.slug ? (
            <OtherPost dir="next">
              <OtherPostLabel>Next</OtherPostLabel>
              <OtherPostTitle>
                <Link to={`/blog/${next.fields?.slug}`}>
                  {next.frontmatter?.title}
                </Link>
              </OtherPostTitle>
            </OtherPost>
          ) : null}
        </OtherPosts>
      </article>
    </Layout>
  );
};

export const BlogPostById = graphql`
  query BlogPost($id: String!, $previousPostId: String, $nextPostId: String) {
    post: file(id: { eq: $id }) {
      childMdx {
        timeToRead
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
