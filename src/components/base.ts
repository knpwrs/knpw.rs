import { styled } from 'linaria/react';
import { tailwindQueries } from 'common-breakpoints';

export const mq = Object.fromEntries(
  Object.entries(tailwindQueries).map(([key, query]) => [
    key,
    `@media ${query}`,
  ]),
) as typeof tailwindQueries;

export const H1 = styled.h1`
  font-size: 48px;
  font-weight: ExtraBold;
  letter-spacing: -0.5px;
`;
