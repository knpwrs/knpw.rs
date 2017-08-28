/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import dateformat from 'dateformat';
import { ShareButtons } from 'react-share';
import ReactDisqusThread from 'react-disqus-thread';
import GatsbyLink from 'gatsby-link';
import g from 'glamorous';
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

const calcPadding = theme => ({
  padding: `0 ${theme.spacing}`,
  [theme.largeMedia]: {
    paddingLeft: theme.centerPadding,
    paddingRight: theme.centerPadding,
  },
});

const Main = g.main(({ theme }) => ({
  color: theme.textColor,
}));

const Header = g.header(({ theme }) => ({
  ...calcPadding(theme),
}));

const Footer = g.footer(({ theme }) => ({
  ...calcPadding(theme),
}));

const SpaceDiv = g.div(({ theme }) => ({
  ...calcPadding(theme),
}));

const PostWrap = g.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '>*': {
    width: '100vw',
    ':not(.gatsby-highlight)': {
      ...calcPadding(theme),
    },
  },
  '> .gatsby-highlight > pre': {
    ...calcPadding(theme),
    paddingTop: theme.spacing,
    paddingBottom: theme.spacing,
  },
}));

const BlogPost = ({ data, pathContext }) => {
  const { markdownRemark: post } = data;
  const { title, siteUrl } = data.site.siteMetadata;
  const { next, prev } = pathContext;

  const isProduction = process.env.NODE_ENV === 'production';
  const fullUrl = `${siteUrl}${post.frontmatter.path}`;

  return (
    <Main>
      <Helmet>
        <title>{post.frontmatter.title} &middot; {title}</title>
      </Helmet>
      <article>
        <Header>
          <h1>
            {post.frontmatter.title}
          </h1>
          <time dateTime={dateformat(post.frontmatter.date, 'isoDateTime')}>
            {dateformat(post.frontmatter.date, 'mmmm d, yyyy')}
          </time>
          <TagsList tags={post.frontmatter.tags} />
        </Header>
        <PostWrap dangerouslySetInnerHTML={{ __html: post.html }} />
        <Footer>
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
        </Footer>
      </article>
      <SpaceDiv>
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
      </SpaceDiv>
    </Main>
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
