import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blocks } from '@/lib/db/schema';
import { syncBlocksSchema } from '@/lib/validation/schemas';
import { eq } from 'drizzle-orm';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Handle non-UUID page IDs (e.g., 'page-variables' or demo pages) gracefully
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({
        success: true,
        blocks: [],
        isLocalFallback: true,
      });
    }

    const pageBlocks = await db
      .select()
      .from(blocks)
      .where(eq(blocks.pageId, id))
      .orderBy(blocks.position);

    return NextResponse.json({ success: true, blocks: pageBlocks });
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return NextResponse.json({ success: false, error: errorObj?.message || 'Failed to fetch page blocks' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = syncBlocksSchema.parse(body);

    // Handle non-UUID page IDs (e.g., 'page-variables' or demo pages) gracefully
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({
        success: true,
        message: 'Local session synchronized',
        isLocalFallback: true,
      });
    }

    // Delete existing blocks for page and insert updated block array with sequential re-indexing (0, 1, 2...)
    await db.delete(blocks).where(eq(blocks.pageId, id));

    if (validatedData.blocks.length > 0) {
      await db.insert(blocks).values(
        validatedData.blocks.map((b, index) => ({
          pageId: id,
          type: b.type,
          content: b.content,
          language: b.language || 'python',
          position: index, // Enforces 0-indexed sequential ordering on save
        }))
      );
    }

    return NextResponse.json({ success: true, message: 'Blocks synchronized successfully' });
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return NextResponse.json({ success: false, error: errorObj?.message || 'Failed to sync blocks' }, { status: 400 });
  }
}
