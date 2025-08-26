import s from '../styles/dashboard.module.css';
import React, { useEffect, useState } from 'react';
import { get, post } from '../lib/api.js';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const widgetsDefault = [
  { id:'sales', title:'Sales Overview' },
  { id:'purchase', title:'Purchase Overview' },
  { id:'inventory', title:'Inventory Summary' },
  { id:'product', title:'Product Summary' },
  { id:'graph', title:'Sales & Purchase Graph' },
  { id:'top', title:'Top Products' },
];

export default function Dashboard(){
  const [stats,setStats]=useState(null);
  const [widgets,setWidgets]=useState(widgetsDefault);

  useEffect(()=>{ (async ()=>{
    const s = await get('/api/stats'); setStats(s);
    const l = await get('/api/layout/home'); if(l.widgets?.length) setWidgets(l.widgets.map(w=>widgetsDefault.find(x=>x.id===w.id) || w));
  })(); },[]);

  const saveLayout = async (ws)=>{
    setWidgets(ws);
    await post('/api/layout/home', { widgets: ws.map((w,i)=>({ id:w.id, order:i })) });
    toast.success('Layout saved');
  };

  const onDragStart = (e, id)=>{ e.dataTransfer.setData('text/plain', id); };
  const onDrop = (e, targetId)=>{
    const sourceId = e.dataTransfer.getData('text/plain');
    if(!sourceId) return;
    const list = [...widgets];
    const from = list.findIndex(w=>w.id===sourceId);
    const to = list.findIndex(w=>w.id===targetId);
    if(from===-1 || to===-1) return;
    const [item] = list.splice(from,1);
    list.splice(to,0,item);
    saveLayout(list);
  };
  const allow = (e)=> e.preventDefault();

  const graphData = (stats?.monthlySales||[]).map((v,i)=>({ name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], Sales: v }));

  const Widget = ({ w, children })=>(
    <div className={s.cardTall+" "+s.widget} draggable onDragStart={e=>onDragStart(e,w.id)} onDragOver={allow} onDrop={e=>onDrop(e,w.id)}>
      <h3>{w.title}</h3>
      <div>{children}</div>
    </div>
  );

  return (
    <div className={s.gridHome} style={{gridTemplateRows:'auto', gridAutoRows:'minmax(120px,auto)'}}>
      {widgets.map(w=>{
        if(w.id==='sales') return <div key={w.id} style={{gridColumn:"span 4"}}><Widget w={w}><div className="kpi"><div>Revenue</div><b>${stats?.revenue?.toFixed?.(2)||0}</b></div></Widget></div>;
        if(w.id==='purchase') return <div key={w.id} style={{gridColumn:"span 4"}}><Widget w={w}><div className="kpi"><div>Purchases</div><b>{stats?.productsSold||0}</b></div></Widget></div>;
        if(w.id==='inventory') return <div key={w.id} style={{gridColumn:"span 4"}}><Widget w={w}><div className="kpi"><div>In Stock</div><b>{stats?.productsInStock||0}</b></div></Widget></div>;
        if(w.id==='product') return <div key={w.id} style={{gridColumn:"span 4"}}><Widget w={w}><div className="small">Suppliers & Categories</div></Widget></div>;
        if(w.id==='graph') return <div key={w.id} style={{gridColumn:"span 8"}}><Widget w={w}>
          <div className={s.graph}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="Sales" /></BarChart>
            </ResponsiveContainer>
          </div>
        </Widget></div>;
        if(w.id==='top') return <div key={w.id} style={{gridColumn:"span 4"}}><Widget w={w}>
          <ul style={{margin:0,paddingLeft:16}}>
            {(stats?.top||[]).map((t,i)=>(<li key={i}>{i+1}. {t.name} — {t.sold} sold</li>))}
          </ul>
        </Widget></div>;
        return null;
      })}
    </div>
  );
}
