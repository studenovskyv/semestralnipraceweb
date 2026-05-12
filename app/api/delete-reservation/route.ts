import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <--- Přidat tento import

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await sql`DELETE FROM rezervace WHERE id = ${id}`;

    // Tohle vymaže mezipaměť hlavní stránky
    revalidatePath('/'); 

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba' }, { status: 500 });
  }
}