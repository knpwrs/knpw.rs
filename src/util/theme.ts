import { styled } from 'linaria/react';
import { kebabCase } from 'lodash';
import '@fontsource/poppins';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/800.css';
import background from './background';

const theme = {
  spacing: '30px',
  colorTextPrimary: '#353535',
  colorTextAccent: '#ba181b',
  colorTextSecondary: '#CCC',
  fontFamily: 'Poppins',
  fontWeightHeader: 800,
  fontWeightHeaderSecondary: 600,
  maxWidthHeader: '1740px',
  maxWidthContent: '1140px',
};

const ThemeWrapper = styled.div`
  ${Object.entries(theme)
    .map(([key, val]) => `--${kebabCase(key)}: ${val};`)
    .join('\n')}
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: ${background};

  font-family: ${car('fontFamily')};
  color: ${car('colorTextPrimary')};

  :global() {
    a {
      color: ${car('colorTextPrimary')};
      text-decoration: none;
      font-weight: 600;
      transition: color ease 2s;

      &:hover {
        color: ${car('colorTextAccent')};
        transition: color cubic-bezier(0.19, 1, 0.22, 1) 200ms;
      }
    }
  }
`;

export default ThemeWrapper;

export function car(name: keyof typeof theme) {
  return `var(--${kebabCase(name)})`;
}
