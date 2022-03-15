import { Link } from 'gatsby';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import type { HTMLProps, PropsWithChildren } from 'react';
import { FaGithub, FaTwitter, FaCreativeCommonsZero } from 'react-icons/fa';
import ThemeWrapper, { car } from '../util/theme';
import { mq } from './base';
import { Logo } from './logo';

const Header = styled.header`
  width: 100vw;
  height: 75px;
  max-width: ${car('maxWidthHeader')};
  ${mq.sm} {
    padding: 0 ${car('spacing')};
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${mq.sm} {
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const NavUl = styled.ul`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  & > li {
    flex-shrink: 1;
    margin-left: calc(${car('spacing')} / 3);
    &.icon {
      position: relative;
      bottom: 2px;
    }
  }
`;

const navLink = css`
  font-weight: ${car('fontWeightHeaderSecondary')};
  text-decoration: none;
  color: ${car('colorTextPrimary')};
`;

const Main = styled.main`
  width: 100vw;
  max-width: calc(${car('maxWidthContent')} + 2 * ${car('spacing')});
  padding: 0 ${car('spacing')};
`;

export const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: ExtraBold;
  letter-spacing: -0.5px;

  ${mq.sm} {
    margin: 0;
    font-size: 48px;
  }
`;

const Footer = styled.footer`
  width: 100vw;
  max-width: calc(${car('maxWidthContent')} + 2 * ${car('spacing')});
  padding: 0 ${car('spacing')};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 12px;
  margin-top: auto;
`;

export type Props = PropsWithChildren<
  { title?: string } & Pick<HTMLProps<HTMLDivElement>, 'className'>
>;

function Layout({ children, title, className }: Props) {
  return (
    <ThemeWrapper className={className}>
      <Header>
        <Nav role="navigation">
          <Logo
            className={css`
              line-height: 60px;
              ${mq.md} {
                line-height: 75px;
              }
            `}
          />
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
            <li className="icon">
              <a className={navLink} href={'https://github.com/knpwrs'}>
                <FaGithub size="22" />
              </a>
            </li>
            <li className="icon">
              <a className={navLink} href={'https://twitter.com/knpwrs'}>
                <FaTwitter size="22" />
              </a>
            </li>
          </NavUl>
        </Nav>
      </Header>
      <Main>
        {title ? <PageTitle>{title}</PageTitle> : null}
        {children}
      </Main>
      <Footer>
        <a href="https://creativecommons.org/publicdomain/zero/1.0/">
          <FaCreativeCommonsZero size={22} />
        </a>
        <p>
          To the extent possible under law, <Link to="/">Ken Powers</Link> has
          waived all copyright and related or neighboring rights to this
          website. This work is published from The United States.
        </p>
      </Footer>
    </ThemeWrapper>
  );
}

export default Layout;
