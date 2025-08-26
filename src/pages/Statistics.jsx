import React, { useEffect, useState } from 'react';
import { get, post } from '../lib/api.js';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const defaultRows = [
  { id: 'revenue', title: 'Total Revenue' },
  { id: 'sold', title: 'Products Sold' },
  { id: 'instock', title: 'Products in Stock' },
  { id: 'chart', title: 'Monthly Sales' },
  { id: 'top', title: 'Top Products' }
];

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState(defaultRows);

  useEffect(() => {
    (async () => {
      try {
        const s = await get('/api/stats');
        setStats(s);

        const layout = await get('/api/layout/stats');
        if (layout.widgets?.length) {
          setRows(
            layout.widgets.map((w) => defaultRows.find((x) => x.id === w.id) || w)
          );
        }
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
        toast.error('Failed to load statistics');
      }
    })();
  }, []);

  const saveLayout = async (updatedRows) => {
    setRows(updatedRows);
    try {
      await post('/api/layout/stats', {
        widgets: updatedRows.map((w, i) => ({ id: w.id, order: i }))
      });
      toast.success('Layout saved');
    } catch (err) {
      console.error('Failed to save layout:', err);
      toast.error('Failed to save layout');
    }
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDrop = (e, targetId) => {
    const sourceId = e.dataTransfer.getData('text/plain');
    const updated = [...rows];
    const fromIndex = updated.findIndex((x) => x.id === sourceId);
    const toIndex = updated.findIndex((x) => x.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    saveLayout(updated);
  };

  const allowDrop = (e) => e.preventDefault();

  const monthlySalesData =
    stats?.monthlySales?.map((value, i) => ({
      name: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ][i],
      value
    })) || [];

  const Row = ({ row, children }) => (
    <div
      className="card draggable"
      draggable
      onDragStart={(e) => onDragStart(e, row.id)}
      onDragOver={allowDrop}
      onDrop={(e) => onDrop(e, row.id)}
      style={{ marginBottom: 12 }}
    >
      <h3>{row.title}</h3>
      {children}
    </div>
  );

  if (!stats) return <div style={{ padding: 20 }}>Loading statistics...</div>;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: '1fr',
        gridAutoRows: 'minmax(80px,auto)'
      }}
    >
      {rows.map((row) => {
        if (row.id === 'revenue') {
          return (
            <Row key={row.id} row={row}>
              <div className="kpi">
                <div>Revenue</div>
                <b>${stats.revenue?.toFixed?.(2) || 0}</b>
              </div>
            </Row>
          );
        }
        if (row.id === 'sold') {
          return (
            <Row key={row.id} row={row}>
              <div className="kpi">
                <div>Sold</div>
                <b>{stats.productsSold || 0}</b>
              </div>
            </Row>
          );
        }
        if (row.id === 'instock') {
          return (
            <Row key={row.id} row={row}>
              <div className="kpi">
                <div>In Stock</div>
                <b>{stats.productsInStock || 0}</b>
              </div>
            </Row>
          );
        }
        if (row.id === 'chart') {
          return (
            <Row key={row.id} row={row}>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySalesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Row>
          );
        }
        if (row.id === 'top') {
          return (
            <Row key={row.id} row={row}>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {(stats.top || []).map((product, i) => (
                  <li key={i}>
                    {i + 1}. {product.name} — {product.sold} sold
                  </li>
                ))}
              </ul>
            </Row>
          );
        }
        return null;
      })}
    </div>
  );
}
