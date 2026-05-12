"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Funkce pro načtení dat z API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/get-reservations');
      const data = await res.json();
      // Přístup k datům z Postgres response
      setRows(data.rows || []);
    } catch (err) {
      console.error("Chyba při načítání:", err);
    } finally {
      setLoading(false);
    }
  };

  // Kontrola hesla
  const checkPass = () => {
    if (password === 'admin') {
      setIsAdmin(true);
    } else {
      alert('Špatné heslo!');
    }
  };

  // Jakmile se isAdmin změní na true, načteme data
  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const deleteRes = async (id: number) => {
    if (confirm('Opravdu chcete tuto rezervaci smazat?')) {
      await fetch(`/api/delete-reservation?id=${id}`, { method: 'DELETE' });
      fetchData(); // Znovu načteme seznam po smazání
    }
  };

  return (
    <div className="container" style={{paddingTop: '40px'}}>
      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{margin: 0}}>Admin Panel</h1>
        <Link href="/" style={{textDecoration: 'none', color: '#2563eb', fontWeight: 'bold'}}>← Zpět</Link>
      </div>

      {!isAdmin ? (
        <div className="card" style={{textAlign: 'center', maxWidth: '400px', margin: '60px auto', padding: '40px'}}>
          <h2 style={{marginBottom: '20px'}}>Zabezpečený přístup</h2>
          <input 
            type="password" 
            placeholder="Zadejte admin heslo" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkPass()}
            style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px', textAlign: 'center'}}
          />
          <button onClick={checkPass} className="btn" style={{width: '100%'}}>Vstoupit</button>
        </div>
      ) : (
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h3 style={{margin: 0}}>Seznam všech rezervací</h3>
            {loading && <span>Načítám...</span>}
          </div>
          
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
                <tr><td colSpan={3} style={{padding: '20px', textAlign: 'center', color: '#94a3b8'}}>Žádné rezervace v databázi.</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '12px', fontWeight: 'bold'}}>{r.jmeno}</td>
                    <td style={{padding: '12px'}}>{r.mistnost}</td>
                    <td style={{padding: '12px', textAlign: 'right'}}>
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
      )}
    </div>
  );
}