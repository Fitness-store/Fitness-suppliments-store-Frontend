import React, { useEffect, useState } from 'react';
import { fetchAllUsers, updateUser, deleteUser } from '../../services/adminApi';
import { Search, Edit2, Trash2, X } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => { try { const res = await fetchAllUsers(); setUsers(res.data || []); } catch(e){console.error(e)} finally{setLoading(false)} };
  useEffect(() => { load(); }, []);

  const filtered = users.filter(u => !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  const openEdit = (u) => { setForm({ id: u.id, fullName: u.fullName, email: u.email, phone: u.phone, role: u.role }); setModal('edit'); setError(''); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try { await updateUser(form.id, { fullName: form.fullName, email: form.email, phone: form.phone, role: form.role }); setModal(null); load(); }
    catch(e) { setError(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try { await deleteUser(id); load(); } catch(e) { alert(e.message); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: '#e4b94a' }}></div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Users</h1><p className="text-sm mt-1" style={{ color: 'rgba(228,185,74,0.5)' }}>{users.length} registered users</p></div>
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }} onFocus={e=>e.target.style.borderColor='rgba(228,185,74,0.2)'} onBlur={e=>e.target.style.borderColor='rgba(228,185,74,0.08)'}/>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}>
          {['User','Email','Phone','Role','Actions'].map(h=><th key={h} className="text-left text-xs font-medium uppercase tracking-wider py-3 px-4" style={{ color: 'rgba(228,185,74,0.5)' }}>{h}</th>)}
        </tr></thead><tbody>
          {filtered.map(u=>(
            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)' }}><span className="font-bold text-xs" style={{ color: '#09090b' }}>{u.fullName?.charAt(0)}</span></div><span className="text-sm text-white font-medium">{u.fullName}</span></div></td>
              <td className="py-3 px-4 text-sm text-gray-300">{u.email}</td>
              <td className="py-3 px-4 text-sm text-gray-300">{u.phone}</td>
              <td className="py-3 px-4"><span className={`px-2 py-1 rounded-lg text-xs font-semibold ${u.role === 'SUPER_ADMIN' ? 'bg-purple-500/15 text-purple-400' : u.role === 'ADMIN' ? 'bg-blue-500/15 text-blue-400' : u.role === 'MANAGER' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>{u.role}</span></td>
              <td className="py-3 px-4"><div className="flex gap-1">
                {u.role !== 'SUPER_ADMIN' && (
                  <>
                    <button onClick={()=>openEdit(u)} className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors"><Edit2 size={14}/></button>
                    <button onClick={()=>handleDelete(u.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                  </>
                )}
                {u.role === 'SUPER_ADMIN' && (
                  <span className="text-xs italic px-2 py-2" style={{ color: 'rgba(228,185,74,0.4)' }}>Protected</span>
                )}
              </div></td>
            </tr>
          ))}
        </tbody></table></div>
        {filtered.length===0&&<p className="text-gray-500 text-sm text-center py-8">No users found</p>}
      </div>

      {modal&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setModal(null)}>
          <div className="w-full max-w-md rounded-2xl" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.1)' }} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}><h3 className="text-lg text-white font-semibold">Edit User</h3><button onClick={()=>setModal(null)} className="p-1 rounded-lg hover:bg-white/[0.06] text-gray-400"><X size={18}/></button></div>
            <div className="p-5 space-y-4">
              {error&&<div className="px-4 py-2 rounded-xl text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
              {[{k:'fullName',l:'Full Name'},{k:'email',l:'Email'},{k:'phone',l:'Phone'}].map(({k,l})=>(
                <div key={k}><label className="block text-xs mb-1" style={{ color: 'rgba(228,185,74,0.5)' }}>{l}</label><input value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.08)' }} onFocus={e=>e.target.style.borderColor='rgba(228,185,74,0.25)'} onBlur={e=>e.target.style.borderColor='rgba(228,185,74,0.08)'}/></div>
              ))}
              <div><label className="block text-xs mb-1" style={{ color: 'rgba(228,185,74,0.5)' }}>Role</label><select value={form.role||'USER'} onChange={e=>setForm({...form,role:e.target.value})} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.08)' }}><option value="USER">USER</option><option value="ADMIN">ADMIN</option><option value="MANAGER">MANAGER</option></select></div>
            </div>
            <div className="flex justify-end gap-3 p-5" style={{ borderTop: '1px solid rgba(228,185,74,0.08)' }}>
              <button onClick={()=>setModal(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm font-semibold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)', color: '#09090b' }}>{saving?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
