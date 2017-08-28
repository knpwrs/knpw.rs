import PropTypes from 'prop-types';

const context = PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
  frontmatter: PropTypes.shape({
    date: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  html: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  timeToRead: PropTypes.number.isRequired,
})]);

export default PropTypes.shape({
  next: context,
  prev: context,
});
