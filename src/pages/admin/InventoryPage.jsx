import React, { useEffect, useState } from 'react';
import { adminFetchProducts, adminUpdateStock } from '../../services/adminApi';
import { Search, Warehouse } from 'lucide-react';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const load = async () => {
    try { const r = await adminFetchProducts(); const d = (r.data||[]).sort((a,b)=>a.stock-b.stock); setProducts(d); }
    catch(e){console.error(e)} finally{setLoading(false)}
  };
  useEffect(()=>{load()},[]);

  const filtered = products.filter(p=>!search||p.name?.toLowerCase().includes(search.toLowerCase())||p.brand?.toLowerCase().includes(search.toLowerCase()));

  const save = async (id) => {
    try { await adminUpdateStock(id, Number(editVal)); setEditId(null); load(); }
    catch(e){alert(e.message)}
  };

  if(loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: '#e4b94a' }}/></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl" style={{ background: 'rgba(228,185,74,0.1)' }}><Warehouse size={22} style={{ color: '#e4b94a' }}/></div>
        <div><h1 className="text-2xl font-bold text-white">Inventory</h1><p className="text-sm mt-1" style={{ color: 'rgba(228,185,74,0.5)' }}>Manage product stock levels</p></div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }} onFocus={e=>e.target.style.borderColor='rgba(228,185,74,0.2)'} onBlur={e=>e.target.style.borderColor='rgba(228,185,74,0.08)'}/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
          <div className="p-2 rounded-lg bg-red-500/10"><Warehouse size={18} className="text-red-400"/></div>
          <div><p className="text-xs" style={{ color: 'rgba(228,185,74,0.5)' }}>Out of Stock</p><p className="text-lg font-bold text-white">{products.filter(p=>p.stock===0).length}</p></div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
          <div className="p-2 rounded-lg bg-yellow-500/10"><Warehouse size={18} className="text-yellow-400"/></div>
          <div><p className="text-xs" style={{ color: 'rgba(228,185,74,0.5)' }}>Low Stock (&lt;10)</p><p className="text-lg font-bold text-white">{products.filter(p=>p.stock>0&&p.stock<10).length}</p></div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}>
          {['Product','Brand','Current Stock','Status','Update Stock'].map(h=><th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'rgba(228,185,74,0.5)' }}>{h}</th>)}
        </tr></thead><tbody>
          {filtered.map(p=><tr key={p.productId} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <td className="py-3 px-4 text-sm text-white font-medium">{p.name}</td>
            <td className="py-3 px-4 text-sm text-gray-300">{p.brand}</td>
            <td className="py-3 px-4"><span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.stock===0?'bg-red-500/15 text-red-400':p.stock<10?'bg-yellow-500/15 text-yellow-400':'bg-green-500/15 text-green-400'}`}>{p.stock}</span></td>
            <td className="py-3 px-4 text-sm">{p.stock===0?<span className="text-red-400">Out of stock</span>:p.stock<10?<span className="text-yellow-400">Low</span>:<span className="text-green-400">In stock</span>}</td>
            <td className="py-3 px-4">{editId===p.productId?
              <div className="flex gap-2"><input type="number" value={editVal} onChange={e=>setEditVal(e.target.value)} className="w-20 px-2 py-1 rounded-lg text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.15)' }} autoFocus/><button onClick={()=>save(p.productId)} className="px-3 py-1 text-xs rounded-lg font-semibold" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)', color: '#09090b' }}>Save</button><button onClick={()=>setEditId(null)} className="px-2 py-1 text-gray-400 text-xs">✕</button></div>:
              <button onClick={()=>{setEditId(p.productId);setEditVal(String(p.stock))}} className="px-3 py-1.5 rounded-lg text-white text-xs transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.08)' }}>Edit</button>
            }</td>
          </tr>)}
        </tbody></table></div>
      </div>
    </div>
  );
};
export default InventoryPage;
