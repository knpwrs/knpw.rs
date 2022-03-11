import { styled } from 'linaria/react';
import type { PropsWithChildren } from 'react';
import ThemeWrapper, { car } from '../util/theme';
import { Logo } from './logo';

const Header = styled.header`
  width: 100vw;
  max-width: ${car('maxWidthHeader')};
  padding: 0 ${car('spacing')};
`;

const Main = styled.main`
  width: 100vw;
  max-width: calc(${car('maxWidthContent')} + 2 * ${car('spacing')});
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
      <Main>{children}</Main>
      <Footer>CC0</Footer>
    </ThemeWrapper>
  );
}

export default Layout;
