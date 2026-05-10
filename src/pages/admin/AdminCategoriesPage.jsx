import React, { useEffect, useState } from 'react';
import { adminFetchCategories, adminAddCategory, adminUpdateCategory, adminDeleteCategory } from '../../services/adminApi';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try { const res = await adminFetchCategories(); setCategories(res.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ name: '', description: '' }); setEditId(null); setModal('form'); setError(''); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '' }); setEditId(c.id); setModal('form'); setError(''); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (editId) { await adminUpdateCategory(editId, form); }
      else { await adminAddCategory(form); }
      setModal(null); load();
    } catch (e) { setError(e.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? This only works if no products are linked.')) return;
    try { await adminDeleteCategory(id); load(); } catch (e) { alert(e.message || 'Cannot delete category with products'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: '#e4b94a' }}></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Categories</h1><p className="text-sm mt-1" style={{ color: 'rgba(228,185,74,0.5)' }}>{categories.length} categories</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)', color: '#09090b' }}><Plus size={16}/>Add Category</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="rounded-2xl p-5 transition-all group hover:scale-[1.01]" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.08)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: 'rgba(228,185,74,0.1)' }}><Tag size={18} style={{ color: '#e4b94a' }} /></div>
                <div><h3 className="text-white font-semibold">{c.name}</h3><p className="text-xs text-gray-500 mt-0.5">{c.productCount || 0} products</p></div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            {c.description && <p className="text-sm text-gray-400 mt-3 line-clamp-2">{c.description}</p>}
          </div>
        ))}
      </div>
      {categories.length === 0 && <p className="text-gray-500 text-center py-12">No categories yet. Add your first category!</p>}

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl" style={{ background: '#0c1021', border: '1px solid rgba(228,185,74,0.1)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(228,185,74,0.08)' }}>
              <h3 className="text-lg text-white font-semibold">{editId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-white/[0.06] text-gray-400"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="px-4 py-2 rounded-xl text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
              <div><label className="block text-xs mb-1" style={{ color: 'rgba(228,185,74,0.5)' }}>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.08)' }} onFocus={e=>e.target.style.borderColor='rgba(228,185,74,0.25)'} onBlur={e=>e.target.style.borderColor='rgba(228,185,74,0.08)'} /></div>
              <div><label className="block text-xs mb-1" style={{ color: 'rgba(228,185,74,0.5)' }}>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none resize-none transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(228,185,74,0.08)' }} onFocus={e=>e.target.style.borderColor='rgba(228,185,74,0.25)'} onBlur={e=>e.target.style.borderColor='rgba(228,185,74,0.08)'} /></div>
            </div>
            <div className="flex justify-end gap-3 p-5" style={{ borderTop: '1px solid rgba(228,185,74,0.08)' }}>
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm font-semibold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #e4b94a, #f97316)', color: '#09090b' }}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
