import { styled } from 'linaria/react';
import { kebabCase } from 'lodash';
import '@fontsource/poppins';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/800.css';
import background, { dark as darkBackground } from './background';

export const lightThemeColor = '#FCFCFC';
export const darkThemeColor = '#030303';

const theme = {
  colorTextPrimary: '#353535',
  colorTextAccent: '#ba181b',
  colorTextSecondary: '#ccc',
  background,
  spacing: '30px',
  fontFamily: 'Poppins',
  fontWeightHeader: 800,
  fontWeightHeaderSecondary: 600,
  maxWidthHeader: '1740px',
  maxWidthContent: '1140px',
};

const darkTheme: Partial<typeof theme> = {
  colorTextPrimary: '#fcfcfc',
  colorTextAccent: '#e32427',
  colorTextSecondary: '#cacaca',
  background: darkBackground,
};

const ThemeWrapper = styled.div`
  ${Object.entries(theme)
    .map(([key, val]) => `--${kebabCase(key)}: ${val};`)
    .join('\n')}

  @media(prefers-color-scheme: dark) {
    ${Object.entries(darkTheme)
      .map(([key, val]) => `--${kebabCase(key)}: ${val};`)
      .join('\n')}
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: ${car('background')};

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

    blockquote {
      border-left: 2px solid ${car('colorTextSecondary')};
      margin: 0;
      padding: 0 ${car('spacing')};
    }
  }

  .prism-code {
    padding: calc(${car('spacing')} / 2);
    border-radius: 3px;
  }
`;

export default ThemeWrapper;

export function car(name: keyof typeof theme) {
  return `var(--${kebabCase(name)})`;
}
