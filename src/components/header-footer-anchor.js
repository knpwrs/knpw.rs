import { Link as GatsbyLink } from 'gatsby';
import styled from '@emotion/styled';

export const Link = styled(GatsbyLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.textColor,
  transition: 'color 250ms linear',
  ':hover': {
    color: theme.accentColor,
  },
}));

export const A = Link.withComponent('a');
