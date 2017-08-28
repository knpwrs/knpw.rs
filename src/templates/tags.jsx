import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import pathContextShape from '../shapes/path-context';
import siteShape from '../shapes/site';
import Posts from '../components/posts';

const Tags = ({ pathContext: { posts, tag }, data: { site: { siteMetadata: site } } }) => (
  <main>
    <Helmet>
      <title>{tag} &middot; {site.title}</title>
    </Helmet>
    <h1>{tag}</h1>
    <section>
      A {posts.length} posts collection
    </section>
    <section>
      <Posts posts={posts} />
    </section>
  </main>
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
