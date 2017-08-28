import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import CenterWrap from '../components/center-wrap';
import pathContextShape from '../shapes/path-context';
import siteShape from '../shapes/site';
import Posts from '../components/posts';

const Tags = ({ pathContext: { posts, tag }, data: { site: { siteMetadata: site } } }) => (
  <CenterWrap>
    <Helmet>
      <title>{tag} &middot; {site.title}</title>
    </Helmet>
    <h2>{tag}</h2>
    <section>
      {posts.length} {posts.length !== 0 ? 'post' : 'posts'} in {tag}.
    </section>
    <section>
      <Posts posts={posts} />
    </section>
  </CenterWrap>
);

Tags.propTypes = {
  data: PropTypes.shape({
    site: siteShape,
  }).isRequired,
  pathContext: pathContextShape.isRequired,
};

export default Tags;

export const tagsQuery = graphql`
  query TagsSiteMetadata {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
