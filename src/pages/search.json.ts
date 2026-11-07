import type { APIRoute } from 'astro';
import { getAllNews, isoDate } from '../lib/news';
import { CATEGORIES } from '../data/site';

export const GET: APIRoute = async () => {
  const all = await getAllNews();
  const items = all.map((n) => ({
    t: n.data.title,
    u: `/news/${n.id}/`,
    d: isoDate(n.data.date),
    c: CATEGORIES[n.data.categories[0]]?.label ?? '',
    e: n.data.excerpt,
    i: n.data.cover ?? '',
    b: (n.body ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1500),
  }));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
