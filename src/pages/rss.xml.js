import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.toSorted((a, b) => {
    const dateDiff = new Date(b.data.date) - new Date(a.data.date);
    return dateDiff !== 0 ? dateDiff : a.data.title.localeCompare(b.data.title);
  });
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: sortedPosts.map((post) => ({
      ...post.data,
      link: `/blg/${post.id}/`,
    })),
  });
}
