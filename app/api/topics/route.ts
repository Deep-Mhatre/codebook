import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { topics } from '@/lib/db/schema';
import { createTopicSchema } from '@/lib/validation/schemas';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const notebookId = searchParams.get('notebookId');

    if (!notebookId) {
      return NextResponse.json({ success: false, error: 'notebookId parameter is required' }, { status: 400 });
    }

    const topicList = await db
      .select()
      .from(topics)
      .where(eq(topics.notebookId, notebookId))
      .orderBy(topics.position);

    return NextResponse.json({ success: true, topics: topicList });
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return NextResponse.json({ success: false, error: errorObj?.message || 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createTopicSchema.parse(body);

    const [newTopic] = await db
      .insert(topics)
      .values({
        notebookId: validatedData.notebookId,
        parentId: validatedData.parentId || null,
        title: validatedData.title,
        position: validatedData.position || 0,
      })
      .returning();

    return NextResponse.json({ success: true, topic: newTopic }, { status: 201 });
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return NextResponse.json({ success: false, error: errorObj?.message || 'Invalid topic data' }, { status: 400 });
  }
}
