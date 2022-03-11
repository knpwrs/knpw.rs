import { Link } from 'gatsby';
import { styled } from 'linaria/react';
import { css } from 'linaria';
import '@fontsource/poppins/600.css';
import { car } from '../util/theme';

const Base = styled.h1`
  font-family: ${car('fontFamily')};
  font-size: 22px;
  font-weight: ${car('fontWeightHeader')};
  letter-spacing: -0.5px;
`;

const Small = styled.small`
  font-size: 75%;
  color: ${car('colorLogoSub')};
  font-weight: ${car('fontWeightHeaderSecondary')};
`;

export function Logo() {
  return (
    <Base>
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
