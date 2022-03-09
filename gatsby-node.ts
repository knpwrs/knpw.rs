import type { GatsbyNode } from 'gatsby';
import { createFilePath } from 'gatsby-source-filesystem';
import { resolve } from 'node:path';
import gql from 'gql-tag';
import type {
  BlogPostsQuery,
  OtherPagesQuery,
} from './src/__generated__/types';

export const onCreateNode: GatsbyNode['onCreateNode'] = async ({
  node,
  actions: { createNodeField },
  getNode,
}) => {
  if (node.internal.type === 'Mdx') {
    const filePath = createFilePath({ node, getNode });

    const slug = filePath.replace(/^\/(?:\d{4}-\d{2}-\d{2}-)?(.+)\/$/, '$1');

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });

    const date = filePath.match(/^\/(\d{4}-\d{2}-\d{2})/);

    if (date && date[1]) {
      createNodeField({
        node,
        name: 'date',
        value: new Date(date[1]),
      });
    }
  }
};

const createBlogPostPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions: { createPage },
  reporter,
}) => {
  const blogTemplate = resolve('src/templates/blog.tsx');
  const blogPostTemplate = resolve('src/templates/blog-post.tsx');
  const blogTagTemplate = resolve('src/templates/blog-tag.tsx');

  const { data, errors } = await graphql<BlogPostsQuery>(
    gql`
      query BlogPosts {
        allFile(
          filter: {
            sourceInstanceName: { eq: "blog" }
            ext: {}
            extension: { eq: "mdx" }
          }
          sort: { fields: childrenMdx___fields___date, order: ASC }
        ) {
          nodes {
            id
            childMdx {
              frontmatter {
                tags
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `,
  );

  if (errors) {
    reporter.panicOnBuild('There was an error building blog posts', errors);

    return;
  }

  const posts = data?.allFile.nodes ?? [];

  const tagsSet = new Set<string>();

  // Pages for Blog Posts
  posts.forEach((post, idx) => {
    const previousPostId = idx === 0 ? null : posts[idx - 1]?.id;
    const nextPostId = idx === posts.length - 1 ? null : posts[idx + 1]?.id;

    const slug = post.childMdx?.fields?.slug;

    if (!slug) {
      return;
    }

    post.childMdx?.frontmatter?.tags?.forEach((tag) => tag && tagsSet.add(tag));

    createPage({
      path: `/blog/${slug}`,
      component: blogPostTemplate,
      context: {
        id: post.id,
        previousPostId,
        nextPostId,
      },
    });
  });

  // Page for Blog Index
  createPage({
    path: '/',
    component: blogTemplate,
    context: {},
  });

  // Tag pages
  tagsSet.forEach((tag) => {
    createPage({
      path: `/blog/tag/${tag}`,
      component: blogTagTemplate,
      context: { tag },
    });
  });
};

const createOtherPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions: { createPage },
  reporter,
}) => {
  const pageTemplate = resolve('src/templates/page.tsx');

  const { data, errors } = await graphql<OtherPagesQuery>(
    gql`
      query OtherPages {
        allFile(
          filter: {
            sourceInstanceName: { eq: "pages" }
            ext: {}
            extension: { eq: "mdx" }
          }
        ) {
          nodes {
            id
            childMdx {
              fields {
                slug
              }
            }
          }
        }
      }
    `,
  );

  if (errors) {
    reporter.panicOnBuild('There was an error building other pages', errors);

    return;
  }

  const pages = data?.allFile.nodes ?? [];

  pages.forEach((page) => {
    const slug = page.childMdx?.fields?.slug;

    if (!slug) {
      return;
    }

    createPage({
      path: `/${slug}`,
      component: pageTemplate,
      context: {
        id: page.id,
      },
    });
  });
};

export const createPages: GatsbyNode['createPages'] = async (...args) => {
  await createBlogPostPages(...args);
  await createOtherPages(...args);
};
