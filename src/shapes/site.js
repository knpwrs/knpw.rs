import PropTypes from 'prop-types';

export default PropTypes.shape({
  siteMetadata: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    siteUrl: PropTypes.string,
  }).isRequired,
}).isRequired;
