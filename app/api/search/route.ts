import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { topics, pages, blocks } from '@/lib/db/schema';
import { ilike, or } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ success: true, results: [] });
    }

    const searchTerm = `%${query.trim()}%`;

    // Search topics, pages, and blocks in parallel
    const [matchingTopics, matchingPages, matchingBlocks] = await Promise.all([
      db.select().from(topics).where(ilike(topics.title, searchTerm)).limit(5),
      db.select().from(pages).where(ilike(pages.title, searchTerm)).limit(5),
      db.select().from(blocks).where(or(ilike(blocks.content, searchTerm))).limit(10),
    ]);

    const results = [
      ...matchingTopics.map((t) => ({ id: t.id, type: 'topic', title: t.title, path: 'Topic' })),
      ...matchingPages.map((p) => ({ id: p.id, type: 'page', title: p.title, path: 'Page' })),
      ...matchingBlocks.map((b) => ({
        id: b.id,
        type: b.type === 'code' ? 'code' : 'text',
        title: b.type === 'code' ? 'Code Snippet' : 'Notes',
        snippet: b.content.substring(0, 100),
        path: `Page ${b.pageId}`,
      })),
    ];

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
