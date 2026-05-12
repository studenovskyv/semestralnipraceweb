import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  let rows: any[] = [];
  try {
    const data = await sql`SELECT * FROM rezervace ORDER BY datum DESC`;
    rows = data.rows;
  } catch (e) {
    console.log("Tabulka jeste neexistuje");
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
      <h1 className="text-4xl font-bold text-center mb-12 text-black">Rezervační systém</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-black">Nová rezervace</h2>
          <form action={createReservation} className="space-y-4">
            <select name="mistnost" className="w-full border p-3 rounded-xl text-black bg-white">
              <option>Velká zasedačka</option>
              <option>Malá zasedačka</option>
              <option>Chill-out zóna</option>
            </select>
            <input name="jmeno" type="text" placeholder="Vaše jméno" className="w-full border p-3 rounded-xl text-black bg-white" required />
            <input name="datum" type="datetime-local" className="w-full border p-3 rounded-xl text-black bg-white" required />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition">Rezervovat</button>
          </form>
        </div>
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 text-black">
          {rows.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-blue-600">{r.mistnost}</h3>
              <p className="mt-2 font-medium">Uživatel: {r.jmeno}</p>
              <p className="text-slate-500 text-sm">Datum: {new Date(r.datum).toLocaleString('cs-CZ')}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}