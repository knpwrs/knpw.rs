const path = require('path');
const { pick } = require('lodash');

function createTagPages(createPage, edges) {
  const tagTemplate = path.resolve('src/templates/tags.jsx');
  const posts = {};

  edges
    .forEach(({ node }) => {
      if (node.frontmatter.tags) {
        node.frontmatter.tags.split(', ')
          .forEach((tag) => {
            if (!posts[tag]) {
              posts[tag] = [];
            }
            posts[tag].push(node);
          });
      }
    });

  Object.keys(posts)
    .forEach((tagName) => {
      const pageSize = 5;
      const pagesSum = Math.ceil(posts[tagName].length / pageSize);

      for (let page = 1; page <= pagesSum; page += 1) {
        createPage({
          path: page === 1 ? `/tag/${tagName}` : `/tag/${tagName}/page/${page}`,
          component: tagTemplate,
          context: {
            posts: posts[tagName],
            tag: tagName,
            pagesSum,
            page,
          },
        });
      }
    });
}

async function generateContent(createPage, graphqlResults) {
  if (graphqlResults.errors) {
    throw graphqlResults.errors;
  }

  const blogPostTemplate = path.resolve('src/templates/blog-post.jsx');

  const posts = graphqlResults.data.allMarkdownRemark.edges;

  createTagPages(createPage, posts);

  posts.forEach(({ node }, index) => {
    const prev = index === posts.length - 1 ? false : posts[index + 1].node;
    const next = index === 0 ? false : posts[index - 1].node;
    createPage({
      path: node.frontmatter.path,
      component: blogPostTemplate,
      context: {
        refPath: node.frontmatter.path,
        prev: prev && pick(prev, ['frontmatter.title', 'frontmatter.path']),
        next: next && pick(next, ['frontmatter.title', 'frontmatter.path']),
      },
    });
  });
}

exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const result = await graphql(`{
    site {
      siteMetadata {
        siteUrl
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          html
          id
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            tags
            title
          }
        }
      }
    }
  }`);
  return generateContent(createPage, result);
};
