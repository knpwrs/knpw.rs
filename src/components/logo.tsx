import type { HTMLProps } from 'react';
import { Link } from 'gatsby';
import { styled } from 'linaria/react';
import { css } from 'linaria';
import '@fontsource/poppins/600.css';
import { car } from '../util/theme';

const Base = styled.h1`
  font-size: 20px;
  font-weight: ${car('fontWeightHeader')};
  letter-spacing: -0.5px;
  margin: 0;
`;

const Small = styled.small`
  font-size: 75%;
  color: ${car('colorTextSecondary')};
  font-weight: ${car('fontWeightHeaderSecondary')};
`;

export function Logo({
  className,
}: Pick<HTMLProps<HTMLHeadingElement>, 'className'>) {
  return (
    <Base className={className}>
      <Small>With</Small>{' '}
      <Link
        className={css`
          color: inherit;
          text-decoration: none;
        `}
        to="/"
      >
        Ken Powers
      </Link>{' '}
      <Small>Comes Ken Responsibility</Small>
    </Base>
  );
}
