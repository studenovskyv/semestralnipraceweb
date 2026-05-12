"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editJmeno, setEditJmeno] = useState('');
  const [editMistnost, setEditMistnost] = useState('');

  const fetchData = async () => {
    const res = await fetch('/api/get-reservations');
    const data = await res.json();
    setRows(data.rows || []);
  };

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  const deleteRes = async (id: number) => {
    if (confirm('Smazat?')) {
      await fetch(`/api/delete-reservation?id=${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const startEdit = (r: any) => {
    setEditId(r.id);
    setEditJmeno(r.jmeno);
    setEditMistnost(r.mistnost);
  };

  const saveEdit = async () => {
    await fetch('/api/update-reservation', {
      method: 'PUT',
      body: JSON.stringify({ id: editId, jmeno: editJmeno, mistnost: editMistnost }),
    });
    setEditId(null);
    fetchData();
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{textAlign: 'center', marginTop: '100px'}}>
        <div className="card" style={{maxWidth: '400px', margin: '0 auto'}}>
          <h2>Admin Login</h2>
          <input type="password" placeholder="Heslo" onChange={(e) => setPassword(e.target.value)} style={{marginBottom: '10px'}} />
          <button onClick={() => password === 'admin' ? setIsAdmin(true) : alert('Chyba')} className="btn" style={{width: '100%'}}>Vstoupit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{paddingTop: '40px'}}>
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1>Správa rezervací (CRUD)</h1>
        <Link href="/" style={{fontWeight: 'bold', textDecoration: 'none'}}>← Zpět na web</Link>
      </div>

      <div className="card">
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{textAlign: 'left', borderBottom: '2px solid #eee'}}>
              <th>Jméno</th>
              <th>Místnost</th>
              <th style={{textAlign: 'right'}}>Akce</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '10px'}}>
                  {editId === r.id ? <input value={editJmeno} onChange={(e) => setEditJmeno(e.target.value)} /> : r.jmeno}
                </td>
                <td style={{padding: '10px'}}>
                  {editId === r.id ? <input value={editMistnost} onChange={(e) => setEditMistnost(e.target.value)} /> : r.mistnost}
                </td>
                <td style={{padding: '10px', textAlign: 'right'}}>
                  {editId === r.id ? (
                    <button onClick={saveEdit} style={{background: '#22c55e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', marginRight: '5px'}}>Uložit</button>
                  ) : (
                    <button onClick={() => startEdit(r)} style={{background: '#e2e8f0', border: 'none', padding: '5px 10px', borderRadius: '5px', marginRight: '5px'}}>Upravit</button>
                  )}
                  <button onClick={() => deleteRes(r.id)} style={{background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px'}}>Smazat</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}