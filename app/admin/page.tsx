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
    await sql`DELETE FROM rezervace WHERE id = ${id as string}`;
    revalidatePath('/admin');
  }

  return (
    <div className="container" style={{paddingTop: '40px'}}>
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{margin: 0}}>Admin Panel</h1>
        <Link href="/" style={{textDecoration: 'none', color: '#2563eb', fontWeight: 'bold'}}>← Zpět na web</Link>
      </div>

      {!isAdmin ? (
        /* JAVASCRIPTOVÁ VARIANTA PŘIHLÁŠENÍ */
        <div className="card" style={{textAlign: 'center', maxWidth: '400px', margin: '60px auto', padding: '40px'}}>
          <h2 style={{marginBottom: '20px'}}>Zabezpečený přístup</h2>
          <input 
            id="adminPass"
            type="password" 
            placeholder="Zadejte admin heslo" 
            style={{
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              marginBottom: '15px',
              textAlign: 'center'
            }}
            onKeyDownCapture={(e) => {
              if (e.key === 'Enter') {
                const val = (document.getElementById('adminPass') as HTMLInputElement).value;
                window.location.href = `/admin?password=${val}`;
              }
            }}
          />
          <button 
            className="btn" 
            style={{width: '100%'}}
            onClickCapture={() => {
              const val = (document.getElementById('adminPass') as HTMLInputElement).value;
              window.location.href = `/admin?password=${val}`;
            }}
          >
            Vstoupit
          </button>
          <p style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '15px'}}>Tip: Heslo je admin</p>
        </div>
      ) : (
        /* TABULKA REZERVACÍ */
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
             <h3 style={{margin: 0}}>Seznam rezervací</h3>
             <span style={{background: '#dcfce7', color: '#166534', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>✓ Přihlášen</span>
          </div>
          
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b'}}>
                <th style={{padding: '12px'}}>Jméno</th>
                <th style={{padding: '12px'}}>Místnost</th>
                <th style={{padding: '12px', textAlign: 'right'}}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                  <td style={{padding: '12px', fontWeight: 'bold'}}>{r.jmeno}</td>
                  <td style={{padding: '12px'}}>{r.mistnost}</td>
                  <td style={{padding: '12px', textAlign: 'right'}}>
                    <form action={deleteReservation}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" style={{background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>Smazat</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop: '20px', textAlign: 'center'}}>
             <Link href="/admin" style={{color: '#94a3b8', fontSize: '0.9rem'}}>Odhlásit</Link>
          </div>
        </div>
      )}
    </div>
  );
}