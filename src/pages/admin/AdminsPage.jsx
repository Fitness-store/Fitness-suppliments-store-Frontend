import React, { useEffect, useState } from 'react';
import { fetchAllAdmins, addAdmin, deleteAdmin } from '../../services/adminApi';
import { Plus, Trash2, X, Shield } from 'lucide-react';

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ fullName:'', email:'', password:'', role:'ADMIN' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => { try { const r = await fetchAllAdmins(); setAdmins(r.data||[]); } catch(e){console.error(e)} finally{setLoading(false)} };
  useEffect(()=>{load()},[]);

  const handleAdd = async () => {
    setSaving(true); setError('');
    try { await addAdmin(form); setModal(false); setForm({fullName:'',email:'',password:'',role:'ADMIN'}); load(); }
    catch(e){setError(e.response?.data?.message||e.message)} finally{setSaving(false)}
  };

  const handleDelete = async (id) => {
    if(!confirm('Remove this admin?')) return;
    try{await deleteAdmin(id);load()}catch(e){alert(e.response?.data?.message||e.message)}
  };

  if(loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: '#e4b94a' }}/></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(228,185,74,0.1)' }}><Shield size={22} style={{ color: '#e4b94a' }}/></div>
          <div><h1 className="text-2xl font-bold text-white">Admin Management</h1><p className="text-sm mt-1" style={{ color: 'rgba(228,185,74,0.5)' }}>Super Admin only</p></div>
        </div>
        <button onClick={()=>{setModal(true);setError('')}} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)', color: '#09090b' }}><Plus size={16}/>Add Admin</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.map(a=>(
          <div key={a.id} className="rounded-2xl p-5 transition-all group hover:scale-[1.01]" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)' }}><span className="font-bold text-sm" style={{ color: '#09090b' }}>{a.fullName?.charAt(0)}</span></div>
                <div><h3 className="text-white font-semibold text-sm">{a.fullName}</h3><p className="text-xs text-gray-500">{a.email}</p></div>
              </div>
              {a.role!=='SUPER_ADMIN'&&<button onClick={()=>handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>}
            </div>
            <div className="mt-3"><span className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${a.role==='SUPER_ADMIN'?'bg-orange-500/15 text-orange-400':'bg-blue-500/15 text-blue-400'}`}>{a.role}</span></div>
          </div>
        ))}
      </div>

      {modal&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setModal(false)}>
          <div className="w-full max-w-md rounded-2xl" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.1)' }} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}><h3 className="text-lg text-white font-semibold">Add Admin</h3><button onClick={()=>setModal(false)} className="p-1 rounded-lg hover:bg-white/[0.06] text-gray-400"><X size={18}/></button></div>
            <div className="p-5 space-y-4">
              {error&&<div className="px-4 py-2 rounded-xl text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
              {[{k:'fullName',l:'Full Name'},{k:'email',l:'Email',t:'email'},{k:'password',l:'Password',t:'password'}].map(({k,l,t})=>(
                <div key={k}><label className="block text-xs mb-1" style={{ color: 'rgba(228,185,74,0.5)' }}>{l}</label><input type={t||'text'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.08)' }} onFocus={e=>e.target.style.borderColor='rgba(228,185,74,0.25)'} onBlur={e=>e.target.style.borderColor='rgba(228,185,74,0.08)'}/></div>
              ))}
              <div><label className="block text-xs mb-1" style={{ color: 'rgba(228,185,74,0.5)' }}>Role</label><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.08)' }}><option value="ADMIN">ADMIN</option><option value="MANAGER">MANAGER</option></select></div>
            </div>
            <div className="flex justify-end gap-3 p-5" style={{ borderTop: '1px solid rgba(228,185,74,0.08)' }}>
              <button onClick={()=>setModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="px-6 py-2 text-sm font-semibold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)', color: '#09090b' }}>{saving?'Adding...':'Add Admin'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminsPage;
