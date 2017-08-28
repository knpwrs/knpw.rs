import React from 'react';
import Helmet from 'react-helmet';

export default () => (
  <div>
    <Helmet
      title="404 &middot; Ken Powers"
      meta={[{ name: 'description', content: 'Not found' }]}
    />
    <section>
      <div>
        <header>
          <div>
            <h1>AW NO! The page you are trying to access is not here.</h1>
          </div>
        </header>
      </div>
    </section>
  </div>
);
