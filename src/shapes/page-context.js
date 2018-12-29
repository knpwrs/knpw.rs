import PropTypes from 'prop-types';
import frontmatter from './frontmatter';

const context = PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
  frontmatter,
})]);

export default PropTypes.shape({
  next: context,
  prev: context,
});
