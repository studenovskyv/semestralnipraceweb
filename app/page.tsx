import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  let rows: any[] = [];
  try {
    const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC`;
    rows = data.rows;
  } catch (e) { console.log(e); }

  async function createReservation(formData: FormData) {
    'use server';
    const mistnost = formData.get('mistnost');
    const jmeno = formData.get('jmeno');
    const datum = formData.get('datum');
    await sql`INSERT INTO rezervace (mistnost, jmeno, datum) VALUES (${mistnost as string}, ${jmeno as string}, ${datum as string})`;
    revalidatePath('/');
  }

  return (
    <div className="container">
      {/* HERO SEKCE - O čem ten web je */}
      <header className="hero card">
        <h1 style={{fontSize: '3rem', marginBottom: '10px'}}>HubSpace <span style={{color: '#2563eb'}}>Prague</span></h1>
        <p style={{fontSize: '1.2rem', color: '#64748b'}}>
          Nejmodernější coworkingové centrum v srdci města. Nabízíme inspirativní prostředí, 
          vysokorychlostní internet a výběrovou kávu pro vaši práci.
        </p>
        <div style={{display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center'}}>
          <div className="stat"><strong>50+</strong> míst</div>
          <div className="stat"><strong>3</strong> zasedačky</div>
          <div className="stat"><strong>24/7</strong> přístup</div>
        </div>
      </header>

      {/* SEKCE SLUŽEB */}
      <section style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', margin: '40px 0'}}>
        <div className="card small">
          <h3>FixDesk</h3>
          <p>Vaše vlastní pracovní místo, které na vás vždy čeká.</p>
        </div>
        <div className="card small">
          <h3>FlexDesk</h3>
          <p>Přijďte, sedněte si, kde je volno, a tvořte.</p>
        </div>
        <div className="card small">
          <h3>Event Hall</h3>
          <p>Prostor pro vaše workshopy a přednášky.</p>
        </div>
      </section>

      <hr style={{border: '0', borderTop: '1px solid #e2e8f0', margin: '60px 0'}} />

      {/* REZERVAČNÍ SYSTÉM - Doplněk stránky */}
      <div id="rezervace" className="grid">
        <div className="card">
          <h2 style={{marginTop: 0}}>Rezervace prostor</h2>
          <p style={{marginBottom: '20px', fontSize: '0.9rem'}}>
            Potřebujete klid na schůzku nebo brainstorming? Zarezervujte si jednu z našich zasedaček přímo zde.
          </p>
          <form action={createReservation}>
            <label>Vyberte místnost</label>
            <select name="mistnost">
              <option>Velká zasedačka (12 osob)</option>
              <option>Malá zasedačka (4 osoby)</option>
              <option>Chill-out zóna (6 osob)</option>
            </select>
            <label>Vaše jméno / Firma</label>
            <input name="jmeno" type="text" placeholder="Např. Google s.r.o." required />
            <label>Datum a čas zahájení</label>
            <input name="datum" type="datetime-local" required />
            <button type="submit" className="btn">Potvrdit rezervaci</button>
          </form>
        </div>

        <div>
          <h3 style={{marginLeft: '15px'}}>Aktuální obsazenost</h3>
          {rows.length === 0 ? (
            <p style={{marginLeft: '15px', color: '#94a3b8'}}>Zatím žádné rezervace.</p>
          ) : (
            rows.map((r) => (
              <div key={r.id} className="res-card">
                <div style={{fontWeight: 'bold', color: '#2563eb'}}>{r.mistnost}</div>
                <div style={{fontSize: '1.1rem', margin: '5px 0'}}>{r.jmeno}</div>
                <div style={{fontSize: '0.8rem', color: '#64748b'}}>
                   {new Date(r.datum).toLocaleString('cs-CZ', { dateStyle: 'long', timeStyle: 'short' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer style={{textAlign: 'center', marginTop: '60px', color: '#94a3b8', fontSize: '0.8rem'}}>
        © 2026 HubSpace Prague. Všechna práva vyhrazena. | Adresa: Václavské náměstí 1, Praha
      </footer>
    </div>
  );
}