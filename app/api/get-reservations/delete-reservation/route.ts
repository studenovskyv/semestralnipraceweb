import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Chybí ID' }, { status: 400 });

  try {
    // Musíme převést ID na číslo, aby ho SQL vzalo
    await sql`DELETE FROM rezervace WHERE id = ${Number(id)}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Chyba při mazání' }, { status: 500 });
  }
}