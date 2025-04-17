import removeMarkdown from 'remove-markdown';

export function postPreview(post: string | undefined): string | undefined {
  if (!post) {
    return undefined;
  }

  return removeMarkdown(post.split(/\n{2,}/g).find((p) => !p.startsWith('#'))!);
}
