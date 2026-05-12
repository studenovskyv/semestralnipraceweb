import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, jmeno, mistnost } = body;

    await sql`
      UPDATE rezervace 
      SET jmeno = ${jmeno}, mistnost = ${mistnost} 
      WHERE id = ${Number(id)}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Chyba při aktualizaci' }, { status: 500 });
  }
}