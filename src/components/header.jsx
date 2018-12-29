/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import styled from '@emotion/styled';
import { Link, A } from './header-footer-anchor';

const Header = styled.header(({ theme }) => ({
  padding: `0 ${theme.spacing}`,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  height: theme.headerHeight,
  lineHeight: theme.headerHeight,
  color: theme.textColor,
  [theme.smallMedia]: {
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'space-between',
    height: '50px',
    lineHeight: '20px',
  },
  [theme.largeMedia]: {
    ...theme.centerPadding,
  },
}));

const H1 = styled.h1(({ theme }) => ({
  fontSize: '1.25rem',
  margin: 0,
  [theme.smallMedia]: {
    fontSize: '1rem',
  },
}));

const Small = styled.small({
  fontSize: '75%',
  opacity: 0.35,
});

const Nav = styled.nav(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  textTransform: 'uppercase',
  a: {
    marginLeft: theme.spacing,
  },
}));

const SiteHeader = () => (
  <Header>
    <H1>
      <Small>With</Small>
      {' '}
      <Link to="/">Ken Powers</Link>
      {' '}
      <Small>comes Ken Responsibility</Small>
    </H1>
    <Nav>
      <Link to="/">Blog</Link>
      <Link to="/about">About</Link>
      <A href="https://github.com/knpwrs">GitHub</A>
      <A href="https://twitter.com/knpwrs">Twitter</A>
    </Nav>
  </Header>
);

export default SiteHeader;
