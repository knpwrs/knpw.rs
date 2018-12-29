/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import styled from '@emotion/styled';
import A from './header-footer-anchor';

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

const Nav = styled.nav({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  textTransform: 'uppercase',
});

const SiteHeader = () => (
  <Header>
    <H1>
      <Small>With</Small>
      {' '}
      <A inline href="/">Ken Powers</A>
      {' '}
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
