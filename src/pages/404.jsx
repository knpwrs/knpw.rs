import React from 'react';
import Helmet from 'react-helmet';
import CenterWrap from '../components/center-wrap';

export default () => (
<CenterWrap>
  <Helmet>
    <title>404 &middot; Ken Powers</title>
  </Helmet>
  <h2>404</h2>
  <p>Whoops! I can't find what you're looking for.</p>
</CenterWrap>
);
