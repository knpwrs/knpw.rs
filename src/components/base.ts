import { styled } from 'linaria/react';
import { tailwindQueries } from 'common-breakpoints';
import { car } from '../util/theme';

export const mq = Object.fromEntries(
  Object.entries(tailwindQueries).map(([key, query]) => [
    key,
    `@media ${query}`,
  ]),
) as typeof tailwindQueries;

export const H1 = styled.h1`
  font-family: ${car('fontFamily')};
  font-size: 48px;
  font-weight: ExtraBold;
  letter-spacing: -0.5px;
`;
