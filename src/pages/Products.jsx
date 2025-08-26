import t from '../styles/table.module.css';
import React, { useEffect, useState } from 'react';
import { get, post, put, del, upload } from '../lib/api.js';
import toast from 'react-hot-toast';

export default function Products(){
  const [items,setItems]=useState([]);
  const [page,setPage]=useState(1);
  const [pages,setPages]=useState(1);
  const [q,setQ]=useState('');
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({ name:'', price:'', quantity:'', threshold:'', expiryDate:'', image:null });

  const load= async (p=page, query=q)=>{
    const data = await get(`/api/products?page=${p}&limit=10&q=${encodeURIComponent(query)}`);
    setItems(data.items||[]); setPage(data.page||1); setPages(data.pages||1);
  };
  useEffect(()=>{ load(1,''); },[]);

  const submitSingle = async ()=>{
    const fd = new FormData();
    Object.entries(form).forEach(([k,v])=>{ if(k==='image'){ if(v) fd.append('image', v);} else fd.append(k, v); });
    const r = await upload('/api/products', fd);
    if(r._id){ toast.success('Product added'); setShowModal(false); load(); }
    else toast.error(r.message||'Failed');
  };

  const submitCSV = async (file)=>{
    const fd = new FormData();
    fd.append('file', file);
    const r = await upload('/api/products/csv', fd);
    if(r.inserted>=0){ toast.success(`Inserted ${r.inserted}`); setShowModal(false); load(); }
    else toast.error('Failed');
  };

  const orderPrompt = async (id)=>{
    const qty = Number(prompt('Enter Quantity to order (+/-):', '1'));
    if(Number.isNaN(qty)) return;
    const r = await post(`/api/products/${id}/order`, { quantityChange: qty });
    if(r._id){ toast.success('Quantity updated'); load(); }
  };
  return (
  <div>
    <div className={`${t.tools} row`}>
      <div className={t.searchRow}>
        <input
          className="input"
          placeholder="Search products..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(1, e.target.value)}
          style={{ width: 260 }}
        />
        <button className="btn secondary" onClick={() => load(1, q)}>Search</button>
      </div>
      <button className="btn" onClick={() => setShowModal(true)}>Add Product</button>
    </div>

    <table className="table">
      <thead><tr><th>Name</th><th>Price</th><th>Qty</th><th>Availability</th><th>Expiry</th><th></th></tr></thead>
      <tbody>
        {items.map(p => (
          <tr key={p._id}>
            <td style={{ cursor: 'pointer' }} onClick={() => orderPrompt(p._id)}>{p.name}</td>
            <td>${p.price}</td>
            <td>{p.quantity}</td>
            <td>
              {p.availability === 'IN_STOCK' && <span className="badge ok">In stock</span>}
              {p.availability === 'LOW_STOCK' && <span className="badge warn">Low stock</span>}
              {p.availability === 'OUT_OF_STOCK' && <span className="badge danger">Out of stock</span>}
              {p.availability === 'EXPIRED' && <span className="badge danger">Expired</span>}
            </td>
            <td>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : '-'}</td>
            <td><button className="btn danger" onClick={async () => { await del('/api/products/' + p._id); load(); }}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className={t.actions}>
      <button className="btn secondary" disabled={page <= 1} onClick={() => load(page - 1, q)}>Prev</button>
      <div className="small">Page {page} of {pages}</div>
      <button className="btn secondary" disabled={page >= pages} onClick={() => load(page + 1, q)}>Next</button>
    </div>

    {showModal && (
      <div className={t.modalBackdrop} onClick={() => setShowModal(false)}>
        <div className={t.modal} onClick={(e) => e.stopPropagation()}>
          <h3>Add Product</h3>
          <div className={t.row}>
            <button className="btn" onClick={submitSingle}>Save Single</button>
            <input type="file" accept=".csv" onChange={e => e.target.files[0] && submitCSV(e.target.files[0])} />
          </div>
          <div className={t.searchRow}>
            <input className="input" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className={t.row}>
            <input className="input" placeholder="Quantity" onChange={e => setForm({ ...form, quantity: e.target.value })} />
            <input className="input" placeholder="Threshold" onChange={e => setForm({ ...form, threshold: e.target.value })} />
          </div>
          <div className={t.row}>
            <input className="input" type="date" onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
            <input className="input" type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
          </div>
          <div className={t.actions}>
            <button className="btn secondary" onClick={() => setShowModal(false)}>Close</button>
            <button className="btn" onClick={submitSingle}>Save</button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
