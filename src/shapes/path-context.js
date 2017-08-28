import PropTypes from 'prop-types';
import frontmatter from './frontmatter';

const context = PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
  frontmatter,
  html: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  timeToRead: PropTypes.number.isRequired,
})]);

export default PropTypes.shape({
  next: context,
  prev: context,
});
