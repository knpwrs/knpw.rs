import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  jsxRuntime: 'automatic',
  jsxImportSource: 'react',
  siteMetadata: {
    title: 'Ken Powers',
    description: 'With Ken Powers Comes Ken Responsibility',
    siteUrl: 'https://www.knpw.rs',
  },
  plugins: [
    'gatsby-plugin-typescript', // Must come before linaria
    'gatsby-plugin-linaria',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-mdx',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './content/pages/',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: './content/blog/',
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: ['gatsby-remark-images', 'gatsby-remark-prismjs'],
      },
    },
    {
      resolve: 'gatsby-plugin-schema-export',
      options: { dest: './src/__generated__/schema.graphql' },
    },
  ],
};

export default config;
