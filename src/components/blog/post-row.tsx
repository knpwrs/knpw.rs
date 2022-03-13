import { graphql, Link } from 'gatsby';
import type { BlogPostRowInfoFragment } from '../../__generated__/types';

export type Props = {
  data: BlogPostRowInfoFragment;
};

export const BlogPostRow = ({ data: { frontmatter, fields } }: Props) => {
  return (
    <li>
      {fields?.shortDate} &middot;{' '}
      <Link to={`/blog/${fields?.slug}`}>{frontmatter?.title}</Link>
      <ul>
        {frontmatter?.tags?.map((tag) => (
          <li key={tag}>
            <Link to={`/blog/tag/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </li>
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
