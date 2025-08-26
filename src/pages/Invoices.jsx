import t from '../styles/table.module.css';
import React, { useEffect, useState } from 'react';
import { get, post, del } from '../lib/api.js';
import toast from 'react-hot-toast';

export default function Invoices() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [view, setView] = useState(null); // invoice currently viewed

  // Load invoices from API
  const load = async (p = 1) => {
    try {
      const data = await get(`/api/invoices?page=${p}&limit=10`);
      setItems(data.items || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (error) {
      toast.error('Failed to load invoices');
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  // Mark an invoice as paid
  const markPaid = async (id) => {
    try {
      const r = await post(`/api/invoices/${id}/paid`, {});
      if (r.status === 'PAID') {
        toast.success('Marked as PAID');
        load(page);
      } else {
        toast.error('Failed to mark as PAID');
      }
    } catch {
      toast.error('Failed to mark as PAID');
    }
  };

  // Delete an invoice and reload the list
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await del(`/api/invoices/${id}`);
      toast.success('Invoice deleted');
      // Adjust page if last item on last page deleted
      if (items.length === 1 && page > 1) {
        load(page - 1);
      } else {
        load(page);
      }
      setView(null);
    } catch {
      toast.error('Failed to delete invoice');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div className="card">
        <div className={`row ${t.tools}`}>
          <div>Invoices</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  No invoices found.
                </td>
              </tr>
            ) : (
              items.map((inv) => (
                <tr key={inv._id}>
                  <td
                    style={{ cursor: 'pointer', color: '#007bff' }}
                    onClick={() => setView(inv)}
                  >
                    {inv.invoiceId}
                  </td>
                  <td>
                    {inv.status === 'PAID' ? (
                      <span className="badge ok">PAID</span>
                    ) : (
                      <span className="badge gray">UNPAID</span>
                    )}
                  </td>
                  <td>${inv.total?.toFixed?.(2) ?? '0.00'}</td>
                  <td>{new Date(inv.createdAt).toLocaleString()}</td>
                  <td>
                    <div className={t.searchRow} style={{ gap: '8px' }}>
                      {inv.status !== 'PAID' && (
                        <button
                          className="btn secondary"
                          onClick={() => markPaid(inv._id)}
                          title="Mark as Paid"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="btn danger"
                        onClick={() => handleDelete(inv._id)}
                        title="Delete Invoice"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={t.actions}>
          <button className="btn secondary" disabled={page <= 1} onClick={() => load(page - 1)}>
            Prev
          </button>
          <div className="small">
            Page {page} of {pages}
          </div>
          <button className="btn secondary" disabled={page >= pages} onClick={() => load(page + 1)}>
            Next
          </button>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {view && (
        <div className={t.modalBackdrop} onClick={() => setView(null)}>
          <div className={t.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Invoice {view.invoiceId}</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {view.items?.length ? (
                  view.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.name}</td>
                      <td>${it.price?.toFixed?.(2) ?? '0.00'}</td>
                      <td>{it.quantity}</td>
                      <td>${it.subtotal?.toFixed?.(2) ?? '0.00'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
              <div>Total</div>
              <b>${view.total?.toFixed?.(2) ?? '0.00'}</b>
            </div>
            <div className={t.actions}>
              <button className="btn secondary" onClick={() => window.print()}>
                Print / Save as PDF
              </button>
              <button className="btn" onClick={() => setView(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
