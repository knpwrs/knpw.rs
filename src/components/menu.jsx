import React from 'react';
import GatsbyLink from 'gatsby-link';

export default () => (
  <nav>
    <div>
      <div>
        <ul>
          <li>
            <GatsbyLink to="/">Home</GatsbyLink>
          </li>
          <li>
            <GatsbyLink to="/about">About</GatsbyLink>
          </li>
          <li>
            <a href="https://github.com/knpwrs">GitHub</a>
          </li>
          <li>
            <a href="https://twitter.com/knpwrs">Twitter</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);
