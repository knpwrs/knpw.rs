import { Link } from 'gatsby';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import type { PropsWithChildren } from 'react';
import ThemeWrapper, { car } from '../util/theme';
import { Logo } from './logo';

const Header = styled.header`
  width: 100vw;
  max-width: ${car('maxWidthHeader')};
  padding: 0 ${car('spacing')};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
`;

const NavUl = styled.ul`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  & > li {
    flex-shrink: 1;
    margin-left: calc(${car('spacing')} / 3);
  }
`;

const navLink = css`
  font-family: ${car('fontFamily')};
  font-weight: ${car('fontWeightHeaderSecondary')};
  text-decoration: none;
  color: ${car('colorTextPrimary')};
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
        <Nav role="navigation">
          <Logo />
          <NavUl>
            <li>
              <Link className={navLink} to={'/'}>
                Blog
              </Link>
            </li>
            <li>
              <Link className={navLink} to={'/about'}>
                About
              </Link>
            </li>
            <li>
              <a className={navLink} href={'https://github.com/knpwrs'}>
                Github
              </a>
            </li>
            <li>
              <a className={navLink} href={'https://twitter.com/knpwrs'}>
                Twitter
              </a>
            </li>
          </NavUl>
        </Nav>
      </Header>
      <Main>{children}</Main>
      <Footer>CC0</Footer>
    </ThemeWrapper>
  );
}

export default Layout;
