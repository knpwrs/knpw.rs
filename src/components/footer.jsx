/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import g from 'glamorous';
import A from './header-footer-anchor';

const Footer = g.footer(({ theme }) => ({
  height: theme.headerHeight,
  textTransform: 'uppercase',
  textAlign: 'center',
  opacity: 0.35,
}));

const SiteFooter = () => (
  <Footer>
    <p>&copy; 2017 Kenneth Powers</p>
    <p>
      <small>
        This site is built with <A inline href="https://www.gatsbyjs.org/">GatsbyJS</A>.
        You can find the <A inline href="https://github.com/knpwrs/knpw.rs">source code on GitHub</A>.
      </small>
    </p>
  </Footer>
);

export default SiteFooter;
