import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { context } from '../shapes/page-context';

const Wrap = styled.div(({ prev }) => ({
  textAlign: prev ? 'left' : 'right',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  textTransform: 'uppercase',
}));

const Span = styled.span(({ theme }) => ({
  color: theme.textColor,
  opacity: 0.35,
  fontWeight: 'bold',
}));

const A = styled.a(({ theme }) => ({
  color: theme.textColor,
  textDecoration: 'none',
  fontWeight: 'bold',
  transition: 'color 250ms linear',
  ':hover': {
    color: theme.accentColor,
  },
}));

const PostNav = ({ prev, post }) => {
  const link = post
    ? <A href={post.frontmatter.path}>{prev ? 'Previous Post' : 'Next Post'}</A>
    : <Span>{prev ? 'Previous Post' : 'Next Post'}</Span>;
  return (
    <Wrap prev={prev}>
      {link}
      <small>{post ? post.frontmatter.title : null}</small>
    </Wrap>
  );
};

PostNav.propTypes = {
  prev: PropTypes.bool,
  post: context.isRequired,
};

PostNav.defaultProps = {
  prev: false,
};

export default PostNav;
