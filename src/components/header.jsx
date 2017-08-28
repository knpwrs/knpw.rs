/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import g from 'glamorous';
import A from './header-footer-anchor';

const maxWidth = '@media(max-width: 680px)';

const Header = g.header(({ theme }) => ({
  textTransform: 'uppercase',
  padding: `0 ${theme.spacing}`,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  height: theme.headerHeight,
  lineHeight: theme.headerHeight,
  color: theme.textColor,
  [maxWidth]: {
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'space-between',
    height: '50px',
    lineHeight: '20px',
  },
}));

const H1 = g.h1({
  fontSize: '1.25rem',
  margin: 0,
  [maxWidth]: {
    fontSize: '1rem',
  },
});

const Small = g.small({
  fontSize: '75%',
  opacity: 0.35,
});

const Nav = g.nav({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const SiteHeader = () => (
  <Header>
    <H1>
      <Small>With</Small>{' '}
      <A inline href="/">Ken Powers</A>{' '}
      <Small>comes Ken Responsibility</Small>
    </H1>
    <Nav>
      <A href="/">Blog</A>
      <A href="/about">About</A>
      <A href="https://github.com/knpwrs">GitHub</A>
      <A href="https://twitter.com/knpwrs">Twitter</A>
    </Nav>
  </Header>
);

export default SiteHeader;
