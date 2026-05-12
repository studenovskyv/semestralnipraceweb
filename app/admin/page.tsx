import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { password?: string }
}) {
  const password = searchParams.password;
  const isAdmin = password === 'admin';

  let rows: any[] = [];
  if (isAdmin) {
    const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC`;
    rows = data.rows;
  }

  async function deleteReservation(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const pass = formData.get('pass');
    await sql`DELETE FROM rezervace WHERE id = ${id as string}`;
    revalidatePath(`/admin?password=${pass}`);
  }

  return (
    <div className="container">
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Admin Panel</h1>
        <Link href="/" style={{textDecoration: 'none', color: '#2563eb', fontWeight: 'bold'}}>← Zpět na web</Link>
      </div>

      {!isAdmin ? (
        /* PŘIHLAŠOVACÍ FORMULÁŘ */
        <div className="card" style={{textAlign: 'center', maxWidth: '400px', margin: '40px auto'}}>
          <h3>Zadejte heslo</h3>
          <form method="GET">
            <input 
              name="password" 
              type="password" 
              placeholder="Heslo (zkus 'admin')" 
              required 
              style={{textAlign: 'center'}}
            />
            <button type="submit" className="btn">Vstoupit</button>
          </form>
        </div>
      ) : (
        /* TABULKA REZERVACÍ (ZOBRAZÍ SE JEN PO ZADÁNÍ HESLA) */
        <div className="card">
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #f1f5f9', textAlign: 'left'}}>
                <th style={{padding: '12px'}}>Uživatel</th>
                <th style={{padding: '12px'}}>Místnost</th>
                <th style={{padding: '12px'}}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                  <td style={{padding: '12px'}}>{r.jmeno}</td>
                  <td style={{padding: '12px'}}>{r.mistnost}</td>
                  <td style={{padding: '12px', textAlign: 'right'}}>
                    <form action={deleteReservation}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="pass" value="admin" />
                      <button type="submit" style={{background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer'}}>Smazat</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{marginTop: '20px', color: '#10b981', fontWeight: 'bold'}}>✓ Přihlášen jako administrátor</p>
        </div>
      )}
    </div>
  );
}