import PropTypes from 'prop-types';

export const context = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  }),
]);

export default PropTypes.shape({
  next: context,
  prev: context,
});
