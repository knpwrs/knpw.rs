import { styled } from 'linaria/react';
import { kebabCase } from 'lodash';
import '@fontsource/poppins';
import '@fontsource/poppins/800.css';

const theme = {
  spacing: '30px',
  colorTextPrimary: '#353535',
  colorLogoSub: '#CCC',
  fontFamily: 'Poppins',
  headerMaxWidth: '1740px',
};

const Theme = styled.div`
  ${Object.entries(theme)
    .map(([key, val]) => `--${kebabCase(key)}: ${val};`)
    .join('\n')}
`;

export default Theme;

export function car(name: keyof typeof theme) {
  return `var(--${kebabCase(name)})`;
}
