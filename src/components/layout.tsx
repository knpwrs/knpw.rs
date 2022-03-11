import { styled } from 'linaria/react';
import type { PropsWithChildren } from 'react';
import ThemeWrapper, { car } from '../util/theme';
import { Logo } from './logo';

const Header = styled.header`
  width: 100vw;
  max-width: ${car('maxWidthHeader')};
  padding: 0 ${car('spacing')};
`;

const Footer = styled.footer``;

export type Props = PropsWithChildren<Record<string, unknown>>;

function Layout({ children }: Props) {
  return (
    <ThemeWrapper>
      <Header>
        <Logo />
      </Header>
      <main>{children}</main>
      <Footer>CC0</Footer>
    </ThemeWrapper>
  );
}

export default Layout;
