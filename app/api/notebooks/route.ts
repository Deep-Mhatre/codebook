import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notebooks } from '@/lib/db/schema';
import { createNotebookSchema } from '@/lib/validation/schemas';
import { getSessionUser } from '@/lib/auth/supabase-server';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    // Fallback demo user id if unauthenticated for local dev
    const userId = user?.id || '00000000-0000-0000-0000-000000000000';

    const userNotebooks = await db
      .select()
      .from(notebooks)
      .where(eq(notebooks.userId, userId));

    return NextResponse.json({ success: true, notebooks: userNotebooks });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notebooks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createNotebookSchema.parse(body);
    const user = await getSessionUser();
    const userId = user?.id || '00000000-0000-0000-0000-000000000000';

    const [newNotebook] = await db
      .insert(notebooks)
      .values({
        userId,
        name: validatedData.name,
      })
      .returning();

    return NextResponse.json({ success: true, notebook: newNotebook }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid input data' },
      { status: 400 }
    );
  }
}
