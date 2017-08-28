import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.string,
  frontmatter: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    path: PropTypes.string,
    tags: PropTypes.string,
  }),
});
