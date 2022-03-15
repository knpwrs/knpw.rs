import { tailwindQueries } from 'common-breakpoints';

export const mq = Object.fromEntries(
  Object.entries(tailwindQueries).map(([key, query]) => [
    key,
    `@media ${query}`,
  ]),
) as typeof tailwindQueries;
