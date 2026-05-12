import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID chybí' }, { status: 400 });
    }

    // Použijeme přímý dotaz bez Number(), aby to bylo odolnější
    await sql`DELETE FROM rezervace WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Detail chyby:", error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}