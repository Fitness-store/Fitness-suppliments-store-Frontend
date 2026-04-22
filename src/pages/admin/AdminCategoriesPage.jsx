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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Categories</h1><p className="text-gray-500 text-sm mt-1">{categories.length} categories</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-all"><Plus size={16}/>Add Category</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="bg-[#0F1629] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-500/10"><Tag size={18} className="text-primary-400" /></div>
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-[#0F1629] border border-white/[0.08] rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-lg text-white font-semibold">{editId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-white/[0.06] text-gray-400"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
              <div><label className="block text-xs text-gray-500 mb-1">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 resize-none" /></div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/[0.06]">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
