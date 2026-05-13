"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Definujeme jednoduchý typ pro rezervaci, aby TypeScript nezlobil
interface Rezervace {
  id: any;
  jmeno: any;
  mistnost: any;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<Rezervace[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [editId, setEditId] = useState<any>(null);
  const [editJmeno, setEditJmeno] = useState('');
  const [editMistnost, setEditMistnost] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/get-reservations');
      const data = await res.json();
      setRows(data.rows || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const deleteRes = async (id: any) => {
    if (confirm('Opravdu smazat?')) {
      const res = await fetch(`/api/delete-reservation?id=${id}`, { method: 'DELETE' });
      if (res.ok) await fetchData();
    }
  };

  const startEdit = (r: Rezervace) => {
    setEditId(r.id);
    setEditJmeno(r.jmeno);
    setEditMistnost(r.mistnost);
  };

  const saveEdit = async () => {
    const res = await fetch('/api/update-reservation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, jmeno: editJmeno, mistnost: editMistnost }),
    });
    if (res.ok) {
      setEditId(null);
      await fetchData();
    }
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{paddingTop: '100px', display: 'flex', justifyContent: 'center'}}>
        <div className="card" style={{maxWidth: '350px', textAlign: 'center'}}>
          <h2>Administrace</h2>
          <input 
            type="password" 
            placeholder="Heslo (admin)" 
            onChange={(e) => setPassword(e.target.value)}
            style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
          />
          <button onClick={() => password === 'admin' ? setIsAdmin(true) : alert('Špatné heslo')} className="btn" style={{width: '100%'}}>Vstoupit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{paddingTop: '40px'}}>
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{margin: 0}}>Správa rezervací</h1>
        <Link href="/" style={{fontWeight: 'bold', color: '#2563eb'}}>← Zpět na web</Link>
      </div>

      <div className="card">
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #f1f5f9', textAlign: 'left'}}>
              <th style={{padding: '10px'}}>Jméno</th>
              <th style={{padding: '10px'}}>Místnost</th>
              <th style={{padding: '10px', textAlign: 'right'}}>Akce</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                <td style={{padding: '10px'}}>
                  {editId === r.id ? <input value={editJmeno} onChange={(e) => setEditJmeno(e.target.value)} style={{padding: '5px'}} /> : r.jmeno}
                </td>
                <td style={{padding: '10px'}}>
                  {editId === r.id ? <input value={editMistnost} onChange={(e) => setEditMistnost(e.target.value)} style={{padding: '5px'}} /> : r.mistnost}
                </td>
                <td style={{padding: '10px', textAlign: 'right'}}>
                  {editId === r.id ? (
                    <button onClick={saveEdit} className="btn" style={{background: '#22c55e', marginRight: '5px', padding: '5px 10px'}}>Uložit</button>
                  ) : (
                    <button onClick={() => startEdit(r)} style={{marginRight: '5px', padding: '5px 10px', cursor: 'pointer'}}>Upravit</button>
                  )}
                  <button onClick={() => deleteRes(r.id)} style={{background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Smazat</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}