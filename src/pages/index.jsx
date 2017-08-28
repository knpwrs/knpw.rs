import React from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql-tag';
import CenterWrap from '../components/center-wrap';
import Posts from '../components/posts';
import postShape from '../shapes/post';

const Index = ({ data: { allMarkdownRemark: { edges: posts } } }) => (
  <CenterWrap>
    <Posts posts={posts.map(post => post.node)} />
  </CenterWrap>
);

Index.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(postShape),
    }),
  }).isRequired,
};

export default Index;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            tags
          }
        }
      }
    }
  }
`;
