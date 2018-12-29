import styled from '@emotion/styled';

export default styled.a(({ inline, theme }) => ({
  marginLeft: inline ? null : theme.spacing,
  textDecoration: 'none',
  color: theme.textColor,
  transition: 'color 250ms linear',
  ':hover': {
    color: theme.accentColor,
  },
}));
