import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function Home() {
  let rows: any[] = [];
  try {
    const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC`;
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
      {/* ČISTÁ NAVIGACE BEZ DUPLICIT */}
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
        <header className="card hero">
          <h1 style={{fontSize: '3.5rem', marginBottom: '20px'}}>Pracujte lépe v <span style={{color: '#2563eb'}}>HubSpace</span></h1>
          <p style={{fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 30px', color: '#64748b'}}>
            Zapomeňte na hlučné kavárny. Nabízíme profesionální zázemí, komunitu kreativců a prostor, který roste s vámi.
          </p>
          <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
             <span style={{background: '#fff', padding: '10px 20px', borderRadius: '50px', border: '1px solid #e2e8f0'}}>☕ Káva zdarma</span>
             <span style={{background: '#fff', padding: '10px 20px', borderRadius: '50px', border: '1px solid #e2e8f0'}}>🚀 1Gbps Internet</span>
          </div>
        </header>

        {/* SLUŽBY */}
        <section id="sluzby">
          <h2 style={{textAlign: 'center', marginBottom: '30px', marginTop: '60px'}}>Naše prostory</h2>
          <div className="grid-3">
            <div className="card small">
              <div style={{fontSize: '3rem'}}>🖥️</div>
              <h3>Open Space</h3>
              <p>Sdílený prostor pro networking a spolupráci.</p>
            </div>
            <div className="card small">
              <div style={{fontSize: '3rem'}}>📞</div>
              <h3>Phone Booths</h3>
              <p>Odhlučněné budky pro vaše soukromé hovory.</p>
            </div>
            <div className="card small">
              <div style={{fontSize: '3rem'}}>🛋️</div>
              <h3>Relax Zóna</h3>
              <p>Místo pro odpočinek, kávu a načerpání sil.</p>
            </div>
          </div>
        </section>

        {/* CENÍK */}
        <section id="cenik">
          <h2 style={{textAlign: 'center', marginBottom: '30px', marginTop: '60px'}}>Členství</h2>
          <div className="grid-3">
            <div className="card" style={{textAlign: 'center', border: '1px solid #e2e8f0'}}>
              <h4>Denní Pass</h4>
              <div className="price-tag">350 Kč</div>
              <p>Přístup na 1 den</p>
            </div>
            <div className="card" style={{textAlign: 'center', borderColor: '#2563eb', borderStyle: 'solid', borderWidth: '2px'}}>
              <h4>Monthly Fix</h4>
              <div className="price-tag">4 500 Kč</div>
              <p>Vlastní stůl 24/7</p>
            </div>
            <div className="card" style={{textAlign: 'center', border: '1px solid #e2e8f0'}}>
              <h4>Týmový kancl</h4>
              <div className="price-tag">od 12k</div>
              <p>Soukromí pro váš tým</p>
            </div>
          </div>
        </section>

        {/* REZERVACE */}
        <section id="rezervace" style={{marginTop: '80px', paddingBottom: '60px'}}>
          <div className="grid-res">
            <div className="card">
              <h2 style={{marginTop: 0}}>Rezervovat zasedačku</h2>
              <form action={createReservation}>
                <label>Vyberte místnost</label>
                <select name="mistnost">
                  <option>Velká zasedačka (Premium)</option>
                  <option>Malá zasedačka (Standard)</option>
                  <option>Nahrávací studio</option>
                </select>
                <label>Jméno / Firma</label>
                <input name="jmeno" type="text" placeholder="Vaše jméno" required />
                <label>Datum a čas</label>
                <input name="datum" type="datetime-local" required />
                <button type="submit" className="btn">Vytvořit rezervaci</button>
              </form>
            </div>

            <div>
              <h3 style={{marginTop: 0, marginBottom: '20px'}}>Nadcházející schůzky</h3>
              {rows.length === 0 ? (
                <p style={{color: '#94a3b8'}}>Zatím žádné rezervace.</p>
              ) : (
                rows.map((r) => (
                  <div key={r.id} className="res-card">
                    <div style={{fontWeight: 'bold', color: '#2563eb'}}>{r.mistnost}</div>
                    <div style={{fontSize: '1.2rem', margin: '5px 0'}}>{r.jmeno}</div>
                    <div style={{fontSize: '0.9rem', color: '#64748b'}}>{new Date(r.datum).toLocaleString('cs-CZ')}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ČISTÁ PATIČKA S ADMIN ODKAZEM */}
        <footer style={{textAlign: 'center', padding: '50px 0', color: '#94a3b8', borderTop: '1px solid #e2e8f0'}}>
          <p>HubSpace Prague &copy; 2026</p>
          <div style={{marginTop: '10px'}}>
            <Link href="/admin" style={{color: '#cbd5e1', textDecoration: 'none', fontSize: '0.8rem'}}>
              Systémová správa (Admin)
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}