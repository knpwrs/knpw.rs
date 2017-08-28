import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import CenterWrap from '../components/center-wrap';
import siteShape from '../shapes/site';

const About = ({ data: { site: { siteMetadata: site } } }) => (
  <CenterWrap>
    <Helmet>
      <title>About &middot; {site.title}</title>
    </Helmet>
    <h2>About</h2>
    <p>All about me.</p>
  </CenterWrap>
);

About.propTypes = {
  data: PropTypes.shape({
    site: siteShape,
  }).isRequired,
};

export default About;

export const aboutPageQuery = graphql`
  query AboutPageSiteMetadata {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
