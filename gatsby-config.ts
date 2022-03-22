import type { GatsbyConfig } from 'gatsby';
import gql from 'gql-tag';
import type { FeedBaseQuery, FeedQuery } from './src/__generated__/types';

const config: GatsbyConfig = {
  jsxRuntime: 'automatic',
  jsxImportSource: 'react',
  siteMetadata: {
    title: 'Ken Powers',
    description: 'With Ken Powers Comes Ken Responsibility',
    siteUrl: 'https://knpw.rs',
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
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: './src/assets/',
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-schema-export',
      options: { dest: './src/__generated__/schema.graphql' },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: gql`
          query FeedBase {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            output: `/rss.xml`,
            title: 'knpw.rs',
            query: gql`
              query Feed {
                allFile(
                  filter: {
                    sourceInstanceName: { eq: "blog" }
                    ext: {}
                    extension: { eq: "mdx" }
                  }
                  sort: { fields: childrenMdx___fields___date, order: DESC }
                ) {
                  nodes {
                    childMdx {
                      frontmatter {
                        title
                      }
                      fields {
                        slug
                        date
                      }
                      excerpt
                      html
                    }
                  }
                }
              }
            `,
            serialize: ({
              query: { site, allFile },
            }: {
              query: FeedQuery & FeedBaseQuery;
            }) => {
              return allFile.nodes.map(({ childMdx }) => {
                const url = `${site?.siteMetadata?.siteUrl}/blog/${childMdx?.fields?.slug}`;
                return {
                  title: childMdx?.frontmatter?.title,
                  description: childMdx?.excerpt,
                  date: childMdx?.fields?.date,
                  url,
                  guid: url,
                  custom_elements: [{ 'content:encoded': childMdx?.html }],
                };
              });
            },
          },
        ],
      },
    },
  ],
};

export default config;
