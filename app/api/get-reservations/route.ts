import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vytáhne vše z tabulky rezervace
    const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC`;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Chyba databáze' }, { status: 500 });
  }
}