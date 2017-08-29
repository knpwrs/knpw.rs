import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import graphql from 'graphql-tag';
import { css } from 'glamor';
import { ThemeProvider } from 'glamorous';
import 'sanitize.css/sanitize.css';
import 'lato-font/css/lato-font.css';
import Header from '../components/header';
import Footer from '../components/footer';
import siteShape from '../shapes/site';
import '../glamor/code';

css.global('html, body', {
  width: '100vw',
  height: '100vh',
  margin: 0,
  padding: 0,
  fontFamily: 'Lato',
});

css.global('h1,h2,h3,h4', {
  textTransform: 'uppercase',
});

const minWidthPx = 680;
const maxWidthPx = 960;
const spacingPx = 10;
const centerPadding = `calc((100vw - ${maxWidthPx - (2 * spacingPx)}px) / 2)`;
const smallMedia = `@media(max-width: ${minWidthPx}px)`;
const largeMedia = `@media(min-width: ${maxWidthPx}px)`;
const textColor = '#333';
const accentColor = '#ab4642';

const theme = {
  spacingPx,
  spacing: `${spacingPx}px`,
  headerHeight: '75px',
  textColor,
  accentColor,
  maxWidthPx,
  minWidthPx,
  smallMedia,
  largeMedia,
  centerPadding: {
    padding: `0 ${spacingPx}px`,
    [largeMedia]: {
      paddingLeft: centerPadding,
      paddingRight: centerPadding,
    },
  },
};

css.global('a', {
  textDecoration: 'none',
  fontWeight: 'bold',
  color: textColor,
  transition: 'color 250ms linear',
});

css.global('a:hover', {
  color: accentColor,
});

css.global('blockquote', {
  background: '#F9F9F9',
  padding: `${spacingPx * 2}px`,
  margin: 0,
});

const Layout = ({ children, data: { site: { siteMetadata: site } } }) => (
  <ThemeProvider theme={theme}>
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
  </ThemeProvider>
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
