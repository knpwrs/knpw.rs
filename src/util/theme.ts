import { styled } from 'linaria/react';
import { kebabCase } from 'lodash';
import '@fontsource/poppins';
import '@fontsource/poppins/800.css';

const theme = {
  spacing: '30px',
  colorTextPrimary: '#353535',
  colorLogoSub: '#CCC',
  fontFamily: 'Poppins',
  maxWidthHeader: '1740px',
};

const ThemeWrapper = styled.div`
  ${Object.entries(theme)
    .map(([key, val]) => `--${kebabCase(key)}: ${val};`)
    .join('\n')}
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default ThemeWrapper;

export function car(name: keyof typeof theme) {
  return `var(--${kebabCase(name)})`;
}
