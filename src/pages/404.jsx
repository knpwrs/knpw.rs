import React from 'react';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import CenterWrap from '../components/center-wrap';

export default () => (
  <Layout>
    <CenterWrap>
      <Helmet>
        <title>404 &middot; Ken Powers</title>
      </Helmet>
      <h2>404</h2>
      <p>Whoops! I can&#8217;t find what you&#8217;re looking for.</p>
    </CenterWrap>
  </Layout>
);
