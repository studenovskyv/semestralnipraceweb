import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { Calendar, User, MapPin, Plus } from 'lucide-react';

export default async function Home() {
  // Sychychr - pokud tabulka neexistuje, tohle zabrání pádu aplikace při prvním spuštění
  let rows = [];
  try {
    const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC`;
    rows = data.rows;
  } catch (e) {
    console.log("Tabulka jeste neexistuje - pockej na vytvoreni v SQL editoru");
  }

  async function createReservation(formData: FormData) {
    'use server';
    const mistnost = formData.get('mistnost');
    const jmeno = formData.get('jmeno');
    const datum = formData.get('datum');
    await sql`INSERT INTO rezervace (mistnost, jmeno, datum) VALUES (${mistnost as string}, ${jmeno as string}, ${datum as string})`;
    revalidatePath('/');
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Rezervujte si svůj prostor</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center"><Plus className="mr-2 text-blue-600" size={20} /> Nová rezervace</h2>
            <form action={createReservation} className="space-y-4">
              <select name="mistnost" className="w-full border p-3 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500">
                <option>Velká zasedačka</option>
                <option>Malá zasedačka</option>
                <option>Chill-out zóna</option>
              </select>
              <input name="jmeno" type="text" placeholder="Vaše jméno" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
              <input name="datum" type="datetime-local" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required />
<button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">Rezervovat</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {rows.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg"><MapPin className="text-blue-600" size={20} /></div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-green-50 text-green-600 rounded">Potvrzeno</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{r.mistnost}</h3>
              <div className="mt-4 space-y-2 text-slate-500 text-sm">
                <div className="flex items-center"><User size={14} className="mr-2" /> {r.jmeno}</div>
                <div className="flex items-center"><Calendar size={14} className="mr-2" /> {new Date(r.datum).toLocaleString('cs-CZ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}