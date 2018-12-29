import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import CenterWrap from '../components/center-wrap';
import pageContextShape from '../shapes/page-context';
import siteShape from '../shapes/site';
import Posts from '../components/posts';

const Tags = ({ pageContext: { posts, tag }, data: { site: { siteMetadata: site } } }) => (
  <Layout>
    <CenterWrap>
      <Helmet>
        <title>
          {tag}
          {' '}
          &middot;
          {' '}
          {site.title}
        </title>
      </Helmet>
      <h2>{tag}</h2>
      <section>
        {posts.length}
        {' '}
        {posts.length !== 1 ? 'posts' : 'post'}
        {' '}
        in
        {' '}
        {tag}
        .
      </section>
      <section>
        <Posts posts={posts} />
      </section>
    </CenterWrap>
  </Layout>
);

Tags.propTypes = {
  data: PropTypes.shape({
    site: siteShape,
  }).isRequired,
  pageContext: pageContextShape.isRequired,
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
