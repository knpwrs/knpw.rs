import React from 'react';
import GatsbyLink from 'gatsby-link';
import dateformat from 'dateformat';
import PropTypes from 'prop-types';
import TagsList from './tags-list';

const Posts = ({ posts }) => (
  <section>
    {posts.map(post => (
      <article key={post.frontmatter.path}>
        <header>
          <h1>
            <GatsbyLink to={post.frontmatter.path}>
              {post.frontmatter.title}
            </GatsbyLink>
          </h1>
        </header>
        <time dateTime={dateformat(post.frontmatter.date, 'isoDateTime')}>
          {dateformat(post.frontmatter.date, 'mmmm d, yyyy')}
        </time>
        <footer>
          <TagsList tags={post.frontmatter.tags} />
        </footer>
      </article>
    ))}
  </section>
);

Posts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.shape({
      frontmatter: PropTypes.shape({
        path: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        tags: PropTypes.string.isRequired,
      }).isRequired,
    }),
  })).isRequired,
};

export default Posts;
