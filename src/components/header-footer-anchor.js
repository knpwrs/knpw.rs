import g from 'glamorous';

export default g.a(({ inline, theme }) => ({
  marginLeft: inline ? null : theme.spacing,
  textDecoration: 'none',
  color: theme.textColor,
  transition: 'color 250ms linear',
  ':hover': {
    color: theme.highlightColor,
  },
}));
