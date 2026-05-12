"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const checkPass = async () => {
    if (password === 'admin') {
      setIsAdmin(true);
      const res = await fetch('/api/get-reservations');
      const data = await res.json();
      setRows(data.rows || []);
    } else {
      alert('Špatné heslo!');
    }
  };

  const deleteRes = async (id: number) => {
    if (confirm('Opravdu smazat?')) {
      await fetch(`/api/delete-reservation?id=${id}`, { method: 'DELETE' });
      const res = await fetch('/api/get-reservations');
      const data = await res.json();
      setRows(data.rows || []);
    }
  };

  return (
    <div className="container" style={{padding: '20px'}}>
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Admin Panel</h1>
        <Link href="/" style={{fontWeight: 'bold', textDecoration: 'none'}}>← Zpět</Link>
      </div>

      {!isAdmin ? (
        <div className="card" style={{maxWidth: '400px', margin: '40px auto', textAlign: 'center'}}>
          <h2>Přihlášení</h2>
          <input 
            type="password" 
            placeholder="Heslo" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
          />
          <button onClick={checkPass} className="btn" style={{width: '100%'}}>Vstoupit</button>
        </div>
      ) : (
        <div className="card">
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{textAlign: 'left', borderBottom: '2px solid #eee'}}>
                <th style={{padding: '10px'}}>Jméno</th>
                <th style={{padding: '10px'}}>Místnost</th>
                <th style={{padding: '10px', textAlign: 'right'}}>Akce</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '10px'}}>{r.jmeno}</td>
                  <td style={{padding: '10px'}}>{r.mistnost}</td>
                  <td style={{padding: '10px', textAlign: 'right'}}>
                    <button onClick={() => deleteRes(r.id)} style={{background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Smazat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}