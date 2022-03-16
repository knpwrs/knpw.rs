import { Giscus } from '@giscus/react';
import { graphql, Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Helmet } from 'react-helmet';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import Layout from '../components/layout';
import { car } from '../util/theme';
import type { BlogPostQuery } from '../__generated__/types';

const MetaContainer = styled.aside`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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

const CommentsWrapper = styled.div`
  margin: ${car('spacing')} 0;
`;

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
  const { body, excerpt, frontmatter, fields } = data.post?.childMdx ?? {};
  const { title, tags = [] } = frontmatter ?? {};
  const { isoDate } = fields ?? {};
  const previous = data?.previousPost?.childMdx ?? {};
  const next = data?.nextPost?.childMdx ?? {};

  if (!body || !title || !excerpt || !isoDate) return null;

  return (
    <Layout>
      <article>
        <Helmet>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={excerpt} />
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={isoDate} />
          <meta property="article:author" content="https://knpw.rs" />
          {tags
            ?.filter((t): t is string => !!t)
            .map((tag) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={excerpt} />
          <meta name="twitter:site" content="@knpwrs" />
          <meta name="twitter:creator" content="@knpwrs" />
          <title>{title}</title>
        </Helmet>
        <h1>{data.post?.childMdx?.frontmatter?.title}</h1>
        <MetaContainer>
          <FaRegClock /> <span>{data.post?.childMdx?.timeToRead} min</span>
          <MetaMidDot />
          <FaRegCalendarAlt />
          <span>{data.post?.childMdx?.fields?.date}</span>
          <MetaMidDot />
          {data.post?.childMdx?.frontmatter?.tags?.map((tag) => (
            <Link
              key={tag}
              to={`/blog/tag/${tag}`}
              className={css`
                font-weight: 400;
                margin-right: calc(${car('spacing')} / 3);
              `}
            >
              #{tag}
            </Link>
          ))}
        </MetaContainer>
        <MDXRenderer>{body}</MDXRenderer>
        <CommentsWrapper>
          <Giscus
            repo="knpwrs/knpw.rs"
            repoId="MDEwOlJlcG9zaXRvcnkxMDE1ODg2ODE="
            category="Blog Post"
            categoryId="DIC_kwDOBg4eyc4COHt1"
            mapping="og:title"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="bottom"
            theme="preferred_color_scheme"
            lang="en"
          />
        </CommentsWrapper>
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
        excerpt
        body
        frontmatter {
          title
          tags
        }
        fields {
          date(formatString: "MMMM Do, YYYY")
          shortDate: date(formatString: "DD MMM")
          isoDate: date(formatString: "YYYY-MM-DD")
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
