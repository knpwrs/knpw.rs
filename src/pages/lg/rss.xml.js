import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE } from '../../consts';

export async function GET(context) {
  const logEntries = await getCollection('log');
  const sortedLogEntries = logEntries.toSorted((a, b) => {
    const dateDiff = new Date(b.data.date) - new Date(a.data.date);
    return dateDiff !== 0 ? dateDiff : a.data.title.localeCompare(b.data.title);
  });
  return rss({
    title: `${SITE_TITLE} · Log`,
    description: "What I've been reading and find interesting.",
    site: context.site,
    items: sortedLogEntries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.body ?? '',
      link: entry.data.url,
    })),
  });
}
