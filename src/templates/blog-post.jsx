/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import dateformat from 'dateformat';
import { ShareButtons } from 'react-share';
import ReactDisqusThread from 'react-disqus-thread';
import g from 'glamorous';
import site from '../shapes/site';
import TagsList from '../components/tags-list';
import PostNav from '../components/post-nav';
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
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  [theme.smallMedia]: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
}));

const HeaderTitle = g.h1(({ theme }) => ({
  width: '50%',
  marginBottom: theme.spacing,
  textTransform: 'uppercase',
  [theme.smallMedia]: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 0,
  },
}));

const HeaderDate = g.time(({ theme }) => ({
  width: '50%',
  textAlign: 'right',
  [theme.smallMedia]: {
    width: '100%',
    textAlign: 'center',
  },
}));

const Footer = g.footer(({ theme }) => ({
  ...calcPadding(theme),
}));

const PostWrap = g.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '>h1,>h2,>h3,>h4': {
    textTransform: 'uppercase',
  },
  '>*': {
    width: '100vw',
    ':not(.gatsby-highlight)': {
      ...calcPadding(theme),
    },
    '> a': {
      textDecoration: 'none',
      fontWeight: 'bold',
      color: theme.textColor,
      transition: 'color 250ms linear',
      ':hover': {
        color: theme.accentColor,
      },
    },
  },
  '> .gatsby-highlight > pre': {
    ...calcPadding(theme),
    paddingTop: theme.spacing,
    paddingBottom: theme.spacing,
  },
}));

const H3 = g.h3({
  textTransform: 'uppercase',
});

const PostNavWrap = g.div(({ theme }) => ({
  ...calcPadding(theme),
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
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
          <HeaderTitle>
            {post.frontmatter.title}
          </HeaderTitle>
          <HeaderDate dateTime={dateformat(post.frontmatter.date, 'isoDateTime')}>
            {dateformat(post.frontmatter.date, 'mmmm d, yyyy')}
          </HeaderDate>
          <TagsList tags={post.frontmatter.tags} />
        </Header>
        <PostWrap dangerouslySetInnerHTML={{ __html: post.html }} />
        <Footer>
          <H3>Share This Post</H3>
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
          <H3>Comments</H3>
          {isProduction &&
            <ReactDisqusThread
              shortname="kenpowers"
              identifier={post.frontmatter.path}
              title={post.frontmatter.title}
              url={fullUrl}
            />}
        </Footer>
      </article>
      <PostNavWrap>
        <PostNav prev post={prev} />
        <PostNav next post={next} />
      </PostNavWrap>
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
