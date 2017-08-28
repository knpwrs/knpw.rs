import PropTypes from 'prop-types';
import frontmatter from './frontmatter';

export default PropTypes.shape({
  id: PropTypes.string,
  frontmatter,
});
