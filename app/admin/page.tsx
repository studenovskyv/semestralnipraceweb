import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { password?: string }
}) {
  // Přečteme heslo z URL adresy
  const password = searchParams.password;
  const isAdmin = password === 'admin';

  let rows: any[] = [];
  if (isAdmin) {
    try {
      const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC`;
      rows = data.rows;
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteReservation(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const pass = formData.get('pass');
    await sql`DELETE FROM rezervace WHERE id = ${id as string}`;
    // Po smazání se vrátíme na admina se správným heslem, aby nás to nevykoplo
    revalidatePath(`/admin`);
  }

  return (
    <div className="container" style={{paddingTop: '40px'}}>
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{margin: 0}}>Admin Panel</h1>
        <Link href="/" style={{textDecoration: 'none', color: '#2563eb', fontWeight: 'bold'}}>← Zpět na web</Link>
      </div>

      {!isAdmin ? (
        /* PŘIHLAŠOVACÍ FORMULÁŘ - Teď už opravdu funkční */
        <div className="card" style={{textAlign: 'center', maxWidth: '400px', margin: '60px auto', padding: '40px'}}>
          <h2 style={{marginBottom: '20px'}}>Zabezpečený přístup</h2>
          <form action="/admin" method="GET">
            <input 
              name="password" 
              type="password" 
              placeholder="Zadejte admin heslo" 
              required 
              style={{
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                marginBottom: '15px',
                textAlign: 'center'
              }}
            />
            <button type="submit" className="btn" style={{width: '100%'}}>Vstoupit</button>
          </form>
          {password && !isAdmin && (
            <p style={{color: '#ef4444', marginTop: '15px', fontWeight: 'bold'}}>Špatné heslo!</p>
          )}
        </div>
      ) : (
        /* TABULKA REZERVACÍ */
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
             <h3 style={{margin: 0}}>Seznam všech rezervací</h3>
             <span style={{background: '#dcfce7', color: '#166534', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>✓ Přihlášen</span>
          </div>
          
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b'}}>
                <th style={{padding: '12px'}}>Jméno</th>
                <th style={{padding: '12px'}}>Místnost</th>
                <th style={{padding: '12px'}}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={3} style={{padding: '20px', textAlign: 'center', color: '#94a3b8'}}>Žádné rezervace nejsou v databázi.</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '12px', fontWeight: 'bold'}}>{r.jmeno}</td>
                    <td style={{padding: '12px'}}>{r.mistnost}</td>
                    <td style={{padding: '12px', textAlign: 'right'}}>
                      <form action={deleteReservation}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="pass" value="admin" />
                        <button type="submit" style={{background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>Smazat</button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          <div style={{marginTop: '30px', textAlign: 'center'}}>
             <Link href="/admin" style={{color: '#94a3b8', fontSize: '0.9rem'}}>Odhlásit se</Link>
          </div>
        </div>
      )}
    </div>
  );
}