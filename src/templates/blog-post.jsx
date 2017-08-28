/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import dateformat from 'dateformat';
import { ShareButtons } from 'react-share';
import ReactDisqusThread from 'react-disqus-thread';
import GatsbyLink from 'gatsby-link';
import site from '../shapes/site';
import TagsList from '../components/tags-list';
import pathContextShape from '../shapes/path-context';
import postShape from '../shapes/post';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton,
  RedditShareButton,
} = ShareButtons;

const BlogPost = ({ data, pathContext }) => {
  const { markdownRemark: post } = data;
  const { title, siteUrl } = data.site.siteMetadata;
  const { next, prev } = pathContext;

  const isProduction = process.env.NODE_ENV === 'production';
  const fullUrl = `${siteUrl}${post.frontmatter.path}`;

  return (
    <main>
      <Helmet>
        <title>{post.frontmatter.title} &middot; {title}</title>
      </Helmet>
      <article>
        <header>
          <h1>
            {post.frontmatter.title}
          </h1>
          <time dateTime={dateformat(post.frontmatter.date, 'isoDateTime')}>
            {dateformat(post.frontmatter.date, 'mmmm d, yyyy')}
          </time>
          <TagsList tags={post.frontmatter.tags} />
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <footer>
          <h3>Share this post on</h3>
          <TwitterShareButton
            url={fullUrl}
            title={post.frontmatter.title}
            via="knpwrs"
          >
            <span>Twitter</span>
          </TwitterShareButton>
          <FacebookShareButton
            url={fullUrl}
          >
            <span>Facebook</span>
          </FacebookShareButton>
          <GooglePlusShareButton
            url={fullUrl}
          >
            <span>Google+</span>
          </GooglePlusShareButton>
          <RedditShareButton
            url={fullUrl}
          >
            <span>Reddit</span>
          </RedditShareButton>
          <h3>Comments</h3>
          {isProduction &&
            <ReactDisqusThread
              shortname="kenpowers"
              identifier={post.frontmatter.path}
              title={post.frontmatter.title}
              url={fullUrl}
            />}
        </footer>
      </article>
      <div>
        {prev &&
          <GatsbyLink to={prev.frontmatter.path}>
            Previous Post <small>{prev.frontmatter.title}</small>
          </GatsbyLink>
        }
        {next &&
          <GatsbyLink to={next.frontmatter.path}>
            Next Post <small>{next.frontmatter.title}</small>
          </GatsbyLink>
        }
      </div>
    </main>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    site,
    allMarkdownRemark: postShape,
  }).isRequired,
  pathContext: pathContextShape.isRequired,
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByPath($refPath: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(frontmatter: { path: { eq: $refPath } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        tags
        title
      }
    }
  }
`;
