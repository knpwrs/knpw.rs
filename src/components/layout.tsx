import { useMemo } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Helmet } from 'react-helmet';
import type { HTMLProps, PropsWithChildren } from 'react';
import { FaGithub, FaTwitter, FaCreativeCommonsZero } from 'react-icons/fa';
import { MDXProvider } from '@mdx-js/react';
import { useColorScheme } from '@mantine/hooks';
import ThemeWrapper, {
  car,
  darkThemeColor,
  lightThemeColor,
} from '../util/theme';
import type { LayoutQuery } from '../__generated__/types';
import { mq } from './base';
import { Logo } from './logo';
import CodeBlock from './codeblock';

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
  const colorScheme = useColorScheme();

  const metadata = useStaticQuery<LayoutQuery>(graphql`
    query Layout {
      svgIcon: file(name: { eq: "icon" }, ext: { eq: ".svg" }) {
        url: publicURL
      }
      lightIcon: file(name: { eq: "icon-light" }, ext: { eq: ".png" }) {
        url: publicURL
      }
      darkIcon: file(name: { eq: "icon-dark" }, ext: { eq: ".png" }) {
        url: publicURL
      }
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  const iconUrl = useMemo(() => {
    const userAgent = global.navigator?.userAgent ?? '';
    const isSafari =
      userAgent.includes('Safari') && !userAgent.includes('Chrome');

    if (isSafari) {
      return metadata[`${colorScheme}Icon`]?.url ?? '';
    }

    return metadata.svgIcon?.url ?? '';
  }, [colorScheme, metadata]);

  return (
    <ThemeWrapper className={className}>
      <Helmet>
        <link rel="shortcut icon" href={iconUrl} />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content={lightThemeColor}
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content={darkThemeColor}
        />
        <title>
          {metadata.site?.siteMetadata?.title} &middot;{' '}
          {metadata.site?.siteMetadata?.description}
        </title>
        <meta
          property="og:title"
          content={metadata.site?.siteMetadata?.title ?? ''}
        />
        <meta
          property="og:site_name"
          content={metadata.site?.siteMetadata?.title ?? ''}
        />
        <meta
          property="og:description"
          content={metadata.site?.siteMetadata?.description ?? ''}
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="profile:first_name" content="Ken" />
        <meta property="profile:last_name" content="Powers" />
        <meta property="profile:username" content="knpwrs" />
        <meta property="profile:gender" content="male" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:description"
          content={metadata.site?.siteMetadata?.description ?? ''}
        />
      </Helmet>
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
              </Link>{' '}
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
        <MDXProvider
          components={{ code: CodeBlock, pre: (props) => <div {...props} /> }}
        >
          {children}
        </MDXProvider>
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
