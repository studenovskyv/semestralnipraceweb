"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Stavy pro editaci
  const [editId, setEditId] = useState<number | null>(null);
  const [editJmeno, setEditJmeno] = useState('');
  const [editMistnost, setEditMistnost] = useState('');

  // 1. Načtení dat z API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/get-reservations');
      const data = await res.json();
      setRows(data.rows || []);
    } catch (err) {
      console.error("Chyba při načítání:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Kontrola hesla
  const checkPass = () => {
    if (password === 'admin') {
      setIsAdmin(true);
    } else {
      alert('Špatné heslo! Zkuste to znovu.');
    }
  };

  // Načíst data hned po přihlášení
  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  // 3. Mazání rezervace
  const deleteRes = async (id: number) => {
    if (confirm('Opravdu chcete tuto rezervaci smazat?')) {
      const res = await fetch(`/api/delete-reservation?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
      } else {
        alert('Chyba při mazání na serveru.');
      }
    }
  };

  // 4. Zahájení editace (předvyplní pole)
  const startEdit = (r: any) => {
    setEditId(r.id);
    setEditJmeno(r.jmeno);
    setEditMistnost(r.mistnost);
  };

  // 5. Uložení editace
  const saveEdit = async () => {
    const res = await fetch('/api/update-reservation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: editId, 
        jmeno: editJmeno, 
        mistnost: editMistnost 
      }),
    });

    if (res.ok) {
      setEditId(null);
      await fetchData();
    } else {
      alert('Chyba při ukládání změn.');
    }
  };

  // PŘIHLAŠOVACÍ OBRAZOVKA
  if (!isAdmin) {
    return (
      <div className="container" style={{paddingTop: '100px'}}>
        <div className="card" style={{maxWidth: '400px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{marginBottom: '20px'}}>Administrace HubSpace</h2>
          <input 
            type="password" 
            placeholder="Zadejte heslo (admin)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkPass()}
            style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px', textAlign: 'center'}}
          />
          <button onClick={checkPass} className="btn" style={{width: '100%'}}>Vstoupit</button>
        </div>
      </div>
    );
  }

  // TABULKA SPRÁVY (CRUD)
  return (
    <div className="container" style={{paddingTop: '40px'}}>
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{margin: 0}}>Správa rezervací (CRUD)</h1>
        <Link href="/" style={{textDecoration: 'none', color: '#2563eb', fontWeight: 'bold'}}>← Zpět na web</Link>
      </div>

      <div className="card">
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b'}}>
              <th style={{padding: '12px'}}>Jméno</th>
              <th style={{padding: '12px'}}>Místnost</th>
              <th style={{padding: '12px', textAlign: 'right'}}>Akce</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading ? (
              <tr><td colSpan={3} style={{padding: '20px', textAlign: 'center', color: '#94a3b8'}}>Žádné rezervace k zobrazení.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                  <td style={{padding: '12px'}}>
                    {editId === r.id ? (
                      <input 
                        value={editJmeno} 
                        onChange={(e) => setEditJmeno(e.target.value)}
                        style={{padding: '5px', borderRadius: '4px', border: '1px solid #2563eb', width: '90%'}}
                      />
                    ) : (
                      <span style={{fontWeight: 'bold'}}>{r.jmeno}</span>
                    )}
                  </td>
                  <td style={{padding: '12px'}}>
                    {editId === r.id ? (
                      <input 
                        value={editMistnost} 
                        onChange={(e) => setEditMistnost(e.target.value)}
                        style={{padding: '5px', borderRadius: '4px', border: '1px solid #2563eb', width: '90%'}}
                      />
                    ) : (
                      r.mistnost
                    )}
                  </td>
                  <td style={{padding: '12px', textAlign: 'right', whiteSpace: 'nowrap'}}>
                    {editId === r.id ? (
                      <button 
                        onClick={saveEdit} 
                        style={{background: '#22c55e', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginRight: '5px'}}
                      >
                        Uložit
                      </button>
                    ) : (
                      <button 
                        onClick={() => startEdit(r)} 
                        style={{background: '#e2e8f0', color: '#475569', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginRight: '5px'}}
                      >
                        Upravit
                      </button>
                    )}
                    <button 
                      onClick={() => deleteRes(r.id)} 
                      style={{background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                      Smazat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}