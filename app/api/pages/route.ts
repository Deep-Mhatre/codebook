import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages, blocks } from '@/lib/db/schema';
import { createPageSchema } from '@/lib/validation/schemas';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('topicId');

    if (!topicId) {
      return NextResponse.json({ success: false, error: 'topicId parameter is required' }, { status: 400 });
    }

    const pageList = await db
      .select()
      .from(pages)
      .where(eq(pages.topicId, topicId))
      .orderBy(pages.position);

    return NextResponse.json({ success: true, pages: pageList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createPageSchema.parse(body);

    const [newPage] = await db
      .insert(pages)
      .values({
        topicId: validatedData.topicId,
        title: validatedData.title,
        position: validatedData.position || 0,
      })
      .returning();

    // Create default initial text block for new page
    await db.insert(blocks).values({
      pageId: newPage.id,
      type: 'text',
      content: 'Start writing your notes or code examples...',
      position: 0,
    });

    return NextResponse.json({ success: true, page: newPage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
