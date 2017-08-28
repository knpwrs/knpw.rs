/* eslint-disable react/no-danger */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';

const PROD = process.env.NODE_ENV === 'production';

const Html = ({ body, headComponents, postBodyComponents }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      {PROD && <style dangerouslySetInnerHTML={{ __html: require('!raw!../public/styles.css') }} />}
      {headComponents}
    </head>
    <body>
      <div
        id="___gatsby"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {postBodyComponents}
    </body>
  </html>
);

Html.propTypes = {
  body: PropTypes.string.isRequired,
  headComponents: PropTypes.node.isRequired,
  postBodyComponents: PropTypes.node.isRequired,
};

export default Html;
