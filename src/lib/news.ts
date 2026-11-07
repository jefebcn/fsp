import { getCollection, type CollectionEntry } from 'astro:content';

export type News = CollectionEntry<'news'>;

let cache: News[] | null = null;
export async function getAllNews(): Promise<News[]> {
  if (!cache) cache = (await getCollection('news')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || (b.data.legacyId ?? 0) - (a.data.legacyId ?? 0));
  return cache;
}
export const newsUrl = (n: News) => `/news/${n.id}/`;
export const byCategory = (list: News[], cat: string) => list.filter((n) => n.data.categories.includes(cat as any));
export const matching = (list: News[], re: RegExp) => list.filter((n) => re.test(n.data.title));

const fmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => fmt.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
