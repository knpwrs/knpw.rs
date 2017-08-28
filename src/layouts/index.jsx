import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import Header from '../components/header';
import Footer from '../components/footer';
import siteShape from '../shapes/site';

const Layout = ({ children, data: { site: { siteMetadata: site } } }) => (
  <main>
    <Helmet>
      <title>{site.title} &middot; {site.description}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="description" content={site.description} />
    </Helmet>
    <Header />
    {children()}
    <Footer />
  </main>
);

Layout.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.shape({
    site: siteShape,
  }).isRequired,
};

export default Layout;

export const indexLayoutQuery = graphql`
  query IndexLayoutQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
