import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // <--- Přidat tento import

export async function PUT(request: Request) {
  try {
    const { id, jmeno, mistnost } = await request.json();

    await sql`
      UPDATE rezervace 
      SET jmeno = ${jmeno}, mistnost = ${mistnost} 
      WHERE id = ${id}
    `;

    revalidatePath('/'); // <--- Vymazat mezipaměť

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba' }, { status: 500 });
  }
}