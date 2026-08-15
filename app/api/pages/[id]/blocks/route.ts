import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blocks } from '@/lib/db/schema';
import { syncBlocksSchema } from '@/lib/validation/schemas';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pageBlocks = await db
      .select()
      .from(blocks)
      .where(eq(blocks.pageId, id))
      .orderBy(blocks.position);

    return NextResponse.json({ success: true, blocks: pageBlocks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = syncBlocksSchema.parse(body);

    // Delete existing blocks for page and insert updated block array
    await db.delete(blocks).where(eq(blocks.pageId, id));

    if (validatedData.blocks.length > 0) {
      await db.insert(blocks).values(
        validatedData.blocks.map((b, index) => ({
          pageId: id,
          type: b.type,
          content: b.content,
          language: b.language || 'python',
          position: index,
        }))
      );
    }

    return NextResponse.json({ success: true, message: 'Blocks synchronized successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
