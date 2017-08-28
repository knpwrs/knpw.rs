import React from 'react';
import GatsbyLink from 'gatsby-link';
import PropTypes from 'prop-types';

const CommaSeparatedTags = ({ tags }) => (
  <div>
    {tags.split(', ').map((tag, index, array) => (
      <span key={tag}>
        <GatsbyLink to={`/tag/${tag}/`}>
          {tag}
        </GatsbyLink>
        {index < array.length - 1 ? ', ' : ''}
      </span>
    ))}
  </div>
);

CommaSeparatedTags.propTypes = {
  tags: PropTypes.string,
};

CommaSeparatedTags.defaultProps = {
  tags: '',
};

export default CommaSeparatedTags;
