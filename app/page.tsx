import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function Home() {
  let rows: any[] = [];
  try {
    const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC LIMIT 5`;
    rows = data.rows;
  } catch (e) { 
    console.log("Chyba při načítání dat:", e); 
  }

  async function createReservation(formData: FormData) {
    'use server';
    const mistnost = formData.get('mistnost');
    const jmeno = formData.get('jmeno');
    const datum = formData.get('datum');
    
    try {
      await sql`INSERT INTO rezervace (mistnost, jmeno, datum) VALUES (${mistnost as string}, ${jmeno as string}, ${datum as string})`;
      revalidatePath('/');
    } catch (e) {
      console.log("Chyba při zápisu:", e);
    }
  }

  return (
    <>
      {/* NAVIGACE */}
      <nav className="navbar">
        <div style={{fontWeight: 'bold', fontSize: '1.4rem', color: '#2563eb'}}>HubSpace.</div>
        <div className="nav-links">
          <a href="#home">Domů</a>
          <a href="#sluzby">Služby</a>
          <a href="#cenik">Ceník</a>
          <a href="#rezervace" style={{background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '10px'}}>Rezervovat</a>
        </div>
      </nav>

      <div className="container" id="home">
        {/* HERO SECTION */}
        <header className="card hero" style={{textAlign: 'center', padding: '60px 20px'}}>
          <h1 style={{fontSize: '3.5rem', marginBottom: '20px'}}>Pracujte lépe v <span style={{color: '#2563eb'}}>HubSpace</span></h1>
          <p style={{fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 30px', color: '#64748b'}}>
            Zapomeňte na hlučné kavárny. Nabízíme profesionální zázemí, komunitu kreativců a prostor, který roste s vámi.
          </p>
          <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
             <span style={{background: '#f8fafc', padding: '10px 20px', borderRadius: '50px', border: '1px solid #e2e8f0'}}>☕ Káva zdarma</span>
             <span style={{background: '#f8fafc', padding: '10px 20px', borderRadius: '50px', border: '1px solid #e2e8f0'}}>🚀 1Gbps Internet</span>
          </div>
        </header>

        {/* SEKCE SLUŽBY */}
        <section id="sluzby" style={{padding: '40px 0'}}>
          <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Naše Služby</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
            <div className="card" style={{padding: '25px', textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '15px'}}>🏢</div>
              <h3>Coworking</h3>
              <p style={{color: '#64748b'}}>Flexibilní pracovní místa v otevřeném prostoru.</p>
            </div>
            <div className="card" style={{padding: '25px', textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '15px'}}>🤝</div>
              <h3>Zasedačky</h3>
              <p style={{color: '#64748b'}}>Soukromé prostory pro vaše meetingy a workshopy.</p>
            </div>
            <div className="card" style={{padding: '25px', textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '15px'}}>🎙️</div>
              <h3>Podcast Studio</h3>
              <p style={{color: '#64748b'}}>Profesionální technika pro vaše nahrávání.</p>
            </div>
          </div>
        </section>

        {/* SEKCE CENÍK */}
        <section id="cenik" style={{padding: '40px 0'}}>
          <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Ceník</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div className="card" style={{border: '1px solid #e2e8f0'}}>
              <h3 style={{color: '#2563eb'}}>Denní Pass</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold'}}>450 Kč <span style={{fontSize: '1rem', color: '#94a3b8'}}>/ den</span></p>
              <ul style={{paddingLeft: '20px', color: '#64748b'}}>
                <li>Přístup 8:00 - 18:00</li>
                <li>Vysokorychlostní WiFi</li>
                <li>Neomezená káva a čaj</li>
              </ul>
            </div>
            <div className="card" style={{border: '2px solid #2563eb'}}>
              <h3 style={{color: '#2563eb'}}>Měsíční Členství</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold'}}>4 900 Kč <span style={{fontSize: '1rem', color: '#94a3b8'}}>/ měsíc</span></p>
              <ul style={{paddingLeft: '20px', color: '#64748b'}}>
                <li>Přístup 24/7</li>
                <li>Vlastní pracovní stůl</li>
                <li>5h zasedačky zdarma</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SEKCE REZERVACE */}
        <section id="rezervace" style={{padding: '40px 0'}}>
          <div className="grid-res">
            <div className="card">
              <h2 style={{marginTop: 0}}>Rezervovat prostor</h2>
              <form action={createReservation}>
                <label>Vyberte místnost</label>
                <select name="mistnost" required>
                  <option>Velká zasedačka (Premium)</option>
                  <option>Malá zasedačka (Standard)</option>
                  <option>Nahrávací studio</option>
                  <option>Eventový prostor</option>
                </select>
                
                <label>Vaše jméno</label>
                <input name="jmeno" type="text" placeholder="Jan Novák" required />
                
                <label>Datum a čas</label>
                <input name="datum" type="datetime-local" required />
                
                <button type="submit" className="btn" style={{width: '100%'}}>Potvrdit rezervaci</button>
              </form>
            </div>

            <div>
              <h3 style={{marginTop: 0, marginBottom: '20px'}}>Aktuální obsazenost</h3>
              {rows.length === 0 ? (
                <p style={{color: '#94a3b8'}}>Zatím žádné rezervace.</p>
              ) : (
                rows.map((r) => (
                  <div key={r.id} className="res-card">
                    <div style={{fontWeight: 'bold', color: '#2563eb'}}>{r.mistnost}</div>
                    <div style={{fontSize: '1.1rem', margin: '5px 0'}}>{r.jmeno}</div>
                    <div style={{fontSize: '0.8rem', color: '#64748b'}}>{new Date(r.datum).toLocaleString('cs-CZ')}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* PATIČKA */}
        <footer style={{textAlign: 'center', padding: '60px 0', color: '#94a3b8', borderTop: '1px solid #e2e8f0'}}>
          <p>HubSpace Prague • Coworking & Community</p>
          <div style={{marginTop: '15px'}}>
            <Link href="/admin" style={{color: '#cbd5e1', textDecoration: 'none', fontSize: '0.8rem'}}>
              Systémová správa
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}