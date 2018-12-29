import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Small = styled.small({
  textTransform: 'uppercase',
});

const A = styled.a(({ theme }) => ({
  textDecoration: 'none',
  color: theme.textColor,
  transition: 'color 250ms linear',
  ':hover': {
    textDecoration: 'underline',
    color: theme.accentColor,
  },
}));

const CommaSeparatedTags = ({ tags }) => (
  <Small>
    Topics:
    {' '}
    {tags.split(', ').map((tag, index, array) => (
      <span key={tag}>
        <A href={`/tag/${tag}/`}>{tag}</A>
        {index < array.length - 1 ? ', ' : ''}
      </span>
    ))}
  </Small>
);

CommaSeparatedTags.propTypes = {
  tags: PropTypes.string,
};

CommaSeparatedTags.defaultProps = {
  tags: '',
};

export default CommaSeparatedTags;
