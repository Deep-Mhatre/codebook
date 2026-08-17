import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { topics } from '@/lib/db/schema';
import { updateTopicSchema } from '@/lib/validation/schemas';
import { eq } from 'drizzle-orm';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateTopicSchema.parse(body);

    const [updatedTopic] = await db
      .update(topics)
      .set({
        ...(validatedData.title ? { title: validatedData.title } : {}),
        ...(validatedData.parentId !== undefined ? { parentId: validatedData.parentId } : {}),
        ...(validatedData.position !== undefined ? { position: validatedData.position } : {}),
        updatedAt: new Date(),
      })
      .where(eq(topics.id, id))
      .returning();

    return NextResponse.json({ success: true, topic: updatedTopic });
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return NextResponse.json({ success: false, error: errorObj?.message || 'Failed to update topic' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(topics).where(eq(topics.id, id));
    return NextResponse.json({ success: true, message: 'Topic deleted successfully' });
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return NextResponse.json({ success: false, error: errorObj?.message || 'Failed to delete topic' }, { status: 500 });
  }
}
