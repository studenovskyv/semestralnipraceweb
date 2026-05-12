import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminPage() {
  let rows: any[] = [];
  try {
    const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC`;
    rows = data.rows;
  } catch (e) {
    console.error(e);
  }

  async function deleteReservation(formData: FormData) {
    'use server';
    const id = formData.get('id');
    try {
      await sql`DELETE FROM rezervace WHERE id = ${id as string}`;
      revalidatePath('/admin');
      revalidatePath('/');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 style={{margin: 0}}>Admin Panel</h1>
          <p style={{color: '#64748b', margin: '5px 0 0 0'}}>Správa rezervací HubSpace Prague</p>
        </div>
        <Link href="/" style={{
          textDecoration: 'none', 
          background: '#f1f5f9', 
          padding: '10px 20px', 
          borderRadius: '10px',
          color: '#1e293b',
          fontWeight: 'bold'
        }}>
          ← Zpět na web
        </Link>
      </div>

      <div className="card" style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #f1f5f9'}}>
              <th style={{padding: '15px'}}>Jméno / Firma</th>
              <th style={{padding: '15px'}}>Místnost</th>
              <th style={{padding: '15px'}}>Datum a čas</th>
              <th style={{padding: '15px', textAlign: 'right'}}>Akce</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4} style={{padding: '20px', textAlign: 'center', color: '#94a3b8'}}>Žádné rezervace k zobrazení.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                  <td style={{padding: '15px', fontWeight: '600'}}>{r.jmeno}</td>
                  <td style={{padding: '15px'}}>{r.mistnost}</td>
                  <td style={{padding: '15px'}}>{new Date(r.datum).toLocaleString('cs-CZ')}</td>
                  <td style={{padding: '15px', textAlign: 'right'}}>
                    <form action={deleteReservation}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" style={{
                        background: '#fee2e2', 
                        color: '#ef4444', 
                        border: 'none', 
                        padding: '8px 15px', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}>
                        Smazat
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <footer style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem'}}>
        Administrační sekce vyžaduje autorizaci (v demo verzi vypnuto)
      </footer>
    </div>
  );
}