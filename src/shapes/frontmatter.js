import PropTypes from 'prop-types';

export default PropTypes.shape({
  date: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
});
