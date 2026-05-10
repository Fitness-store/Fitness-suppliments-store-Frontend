import React, { useEffect, useState } from 'react';
import { adminFetchOrders, adminUpdateOrderStatus } from '../../services/adminApi';

const tabs = ['ALL','PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];
const sc = {PENDING:'bg-yellow-500/15 text-yellow-400',CONFIRMED:'bg-blue-500/15 text-blue-400',SHIPPED:'bg-purple-500/15 text-purple-400',DELIVERED:'bg-green-500/15 text-green-400',CANCELLED:'bg-red-500/15 text-red-400'};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');

  const load = async (s) => {
    setLoading(true);
    try { const r = await adminFetchOrders(s==='ALL'?null:s); setOrders(r.data||[]); }
    catch(e){console.error(e)} finally{setLoading(false)}
  };
  useEffect(()=>{load(tab)},[tab]);

  const upd = async (id,s) => {
    try{await adminUpdateOrderStatus(id,s);load(tab)}catch(e){alert(e.message)}
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Orders</h1><p className="text-sm mt-1" style={{ color: 'rgba(228,185,74,0.5)' }}>Manage customer orders</p></div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(s=><button key={s} onClick={()=>setTab(s)} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all" style={tab===s ? { background: 'rgba(228,185,74,0.12)', color: '#e4b94a' } : { color: '#6b7280' }} onMouseEnter={e => { if(tab!==s) e.currentTarget.style.color='#fff' }} onMouseLeave={e => { if(tab!==s) e.currentTarget.style.color='#6b7280' }}>{s}</button>)}
      </div>
      {loading?<div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: '#e4b94a' }}/></div>:
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}>
          {['Order','Customer','Amount','Status','Date','Update'].map(h=><th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'rgba(228,185,74,0.5)' }}>{h}</th>)}
        </tr></thead><tbody>
          {orders.map(o=><tr key={o.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <td className="py-3 px-4 text-sm font-medium" style={{ color: '#e4b94a' }}>#{o.id}</td>
            <td className="py-3 px-4"><p className="text-sm text-white">{o.customerName}</p><p className="text-xs text-gray-500">{o.customerEmail}</p></td>
            <td className="py-3 px-4 text-sm text-white">₹{o.totalAmount?.toLocaleString()}</td>
            <td className="py-3 px-4"><span className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${sc[o.status]||'bg-gray-500/15 text-gray-400'}`}>{o.status}</span></td>
            <td className="py-3 px-4 text-sm text-gray-400">{o.orderDate}</td>
            <td className="py-3 px-4"><select value={o.status} onChange={e=>upd(o.id,e.target.value)} className="px-2 py-1 rounded-lg text-white text-xs focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.08)' }}>
              {['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(s=><option key={s} value={s}>{s}</option>)}
            </select></td>
          </tr>)}
        </tbody></table></div>
        {orders.length===0&&<p className="text-gray-500 text-center py-8 text-sm">No orders</p>}
      </div>}
    </div>
  );
};
export default AdminOrdersPage;
