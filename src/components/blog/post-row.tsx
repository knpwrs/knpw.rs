import { graphql, Link } from 'gatsby';
import { css } from 'linaria';
import { car } from '../../util/theme';
import type { BlogPostRowInfoFragment } from '../../__generated__/types';

export type Props = {
  data: BlogPostRowInfoFragment;
};

export const BlogPostRow = ({ data: { frontmatter, fields } }: Props) => {
  return (
    <div
      className={css`
        margin-bottom: calc(${car('spacing')} / 2);
      `}
    >
      <span
        className={css`
          font-weight: 600;
        `}
      >
        {fields?.shortDate} &middot;
      </span>{' '}
      <Link to={`/blog/${fields?.slug}`}>{frontmatter?.title}</Link>
      <div>
        {frontmatter?.tags?.flatMap((tag) => [
          <Link
            key={tag}
            to={`/blog/tag/${tag}`}
            className={css`
              font-weight: 400;
              font-size: 10px;
            `}
          >
            #{tag}
          </Link>,
          ' ',
        ])}
      </div>
    </div>
  );
};

export const query = graphql`
  fragment BlogPostRowInfo on Mdx {
    frontmatter {
      title
      tags
    }
    fields {
      slug
      year: date(formatString: "YYYY")
      shortDate: date(formatString: "MMM D")
      date(formatString: "MMMM Do, YYYY")
    }
  }
`;
