import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const { id, jmeno, mistnost } = await request.json();
    await sql`
      UPDATE rezervace 
      SET jmeno = ${jmeno}, mistnost = ${mistnost} 
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba při aktualizaci' }, { status: 500 });
  }
}