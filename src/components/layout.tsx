import { styled } from 'linaria/react';
import type { PropsWithChildren } from 'react';
import Theme, { car } from '../util/theme';
import { Logo } from './logo';

const Header = styled.header`
  display: grid;
  grid-template-columns:
    minmax(${car('spacing')}, 1fr) [content] minmax(
      auto,
      ${car('headerMaxWidth')}
    )
    minmax(${car('spacing')}, 1fr);
`;

const HeaderContent = styled.div`
  grid-area: content;
`;

const Footer = styled.footer``;

export type Props = PropsWithChildren<Record<string, unknown>>;

function Layout({ children }: Props) {
  return (
    <Theme>
      <Header>
        <HeaderContent>
          <Logo />
        </HeaderContent>
      </Header>
      <main>{children}</main>
      <Footer>CC0</Footer>
    </Theme>
  );
}

export default Layout;
