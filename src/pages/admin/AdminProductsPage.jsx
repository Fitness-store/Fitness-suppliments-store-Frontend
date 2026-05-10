import React, { useEffect, useState } from 'react';
import { adminFetchProducts, adminUpdateProduct, adminDeleteProduct, adminFetchCategories, adminUploadProductImage, adminUploadProductImageForCreate } from '../../services/adminApi';
import { addProduct, fetchCategories } from '../../services/api';
import { Search, Plus, Edit2, Trash2, X, Upload, Copy } from 'lucide-react';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [pRes, cRes] = await Promise.all([adminFetchProducts(), adminFetchCategories()]);
      setProducts(pRes.data || []);
      setCategories(cRes.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || String(p.categoryId) === catFilter;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setForm({ name: '', description: '', brand: '', isVegetarian: false, categoryId: '', imageUrl: '', statusActiveInd: 'Y', ingredients: '', nutritionFacts: '', recommendedUsage: '', warning: '', expiryDate: '', variants: [{ flavor: '', netQuantity: '', mrp: '', finalPrice: '', stock: 0 }] });
    setModal('add');
    setError('');
  };

  const openDuplicate = (p) => {
    setForm({
      name: (p.name || '') + ' (Copy)',
      description: p.description || '',
      brand: p.brand || '',
      isVegetarian: p.isVegetarian || false,
      categoryId: p.categoryId || '',
      imageUrl: p.imageUrl || '',
      statusActiveInd: p.statusActiveInd || 'Y',
      ingredients: p.ingredients || '',
      nutritionFacts: p.nutritionFacts || '',
      recommendedUsage: p.recommendedUsage || '',
      warning: p.warning || '',
      expiryDate: p.expiryDate || '',
      variants: p.variants && p.variants.length > 0
        ? p.variants.map(v => ({ flavor: v.flavor || '', netQuantity: v.netQuantity || '', mrp: v.mrp || '', finalPrice: v.finalPrice || '', stock: v.stock || 0 }))
        : [{ flavor: '', netQuantity: '', mrp: '', finalPrice: '', stock: 0 }]
    });
    setModal('add');
    setError('');
  };

    const openEdit = (p) => {
      setForm({ ...p, categoryId: p.categoryId || '', statusActiveInd: p.statusActiveInd || 'Y', variants: p.variants && p.variants.length > 0 ? [...p.variants] : [{ flavor: '', netQuantity: '', mrp: '', finalPrice: '', stock: 0 }] });
      setModal('edit');
      setError('');
    };

    const handleSave = async () => {
      setSaving(true); setError('');
      try {
        if (modal === 'add') {
          const payload = { ...form, categoryId: Number(form.categoryId), isVegetarian: Boolean(form.isVegetarian), variants: form.variants.map(v => ({ ...v, mrp: Number(v.mrp), finalPrice: Number(v.finalPrice), stock: Number(v.stock) })) };
          if (form.expiryDate) payload.expiryDate = form.expiryDate;
          await addProduct(payload);
        } else {
          await adminUpdateProduct(form.productId, { ...form, categoryId: Number(form.categoryId), variants: form.variants.map(v => ({ ...v, mrp: Number(v.mrp), finalPrice: Number(v.finalPrice), stock: Number(v.stock) })) });
        }
        setModal(null); load();
      } catch (e) { setError(e.message || 'Failed to save'); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
      if (!confirm('Deactivate this product?')) return;
      try { await adminDeleteProduct(id); load(); } catch (e) { alert(e.message); }
    };

    const handleImageUpload = async (productId, file) => {
      try { await adminUploadProductImage(productId, file); load(); } catch (e) { alert('Image upload failed'); }
    };

    const handleFormImageUpload = async (file) => {
      if (!file) return;
      setUploadingImage(true);
      setError('');
      try {
        const res = await adminUploadProductImageForCreate(file);
        setForm(prev => ({ ...prev, imageUrl: res.imageUrl || '' }));
      } catch (e) {
        setError(e.message || 'Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    };

    const handleToggleStatus = async (p) => {
      const newStatus = p.statusActiveInd === 'Y' ? 'N' : 'Y';
      try {
        await adminUpdateProduct(p.productId, { statusActiveInd: newStatus });
        load();
      } catch (e) { alert(e.message || 'Failed to toggle status'); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div></div>;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-white">Products</h1><p className="text-gray-500 text-sm mt-1">{products.length} total products</p></div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-all"><Plus size={16} />Add Product</button>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 bg-[#0F1629] border border-white/[0.08] rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-500/50" /></div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-4 py-2.5 bg-[#0F1629] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-primary-500/50">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="bg-[#0F1629] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/[0.06]">
            {['Product', 'Brand', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider py-3 px-4">{h}</th>)}
          </tr></thead><tbody>
              {filtered.map(p => (
                <tr key={p.productId} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4"><div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] overflow-hidden flex-shrink-0">{p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">IMG</div>}</div>
                    <div><p className="text-sm text-white font-medium">{p.name}</p><p className="text-xs text-gray-500">{p.categoryName || 'N/A'}</p></div>
                  </div></td>
                  <td className="py-3 px-4 text-sm text-gray-300">{p.brand}</td>
                  <td className="py-3 px-4"><p className="text-sm text-white font-medium">₹{p.variants && p.variants.length > 0 ? Math.min(...p.variants.map(v => v.finalPrice)) : 0}{p.variants && p.variants.length > 1 ? '+' : ''}</p><p className="text-xs text-gray-500">{p.variants?.length || 0} variants</p></td>
                  <td className="py-3 px-4"><span className={`px-2 py-1 rounded-md text-xs font-bold ${(!p.variants || p.variants.reduce((a, b) => a + b.stock, 0) === 0) ? 'bg-red-500/15 text-red-400' : p.variants.reduce((a, b) => a + b.stock, 0) < 10 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-green-500/15 text-green-400'}`}>{p.variants ? p.variants.reduce((a, b) => a + b.stock, 0) : 0}</span></td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleToggleStatus(p)} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none" style={{ backgroundColor: p.statusActiveInd === 'Y' ? 'rgb(34 197 94 / 0.3)' : 'rgb(239 68 68 / 0.2)' }}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${p.statusActiveInd === 'Y' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4"><div className="flex items-center gap-1">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors" title="Edit"><Edit2 size={14} /></button>
                    <button onClick={() => openDuplicate(p)} className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-primary-400 transition-colors" title="Duplicate"><Copy size={14} /></button>
                    <label className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" title="Upload Image"><Upload size={14} /><input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files[0]) handleImageUpload(p.productId, e.target.files[0]) }} /></label>
                    <button onClick={() => handleDelete(p.productId)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody></table></div>
          {filtered.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No products found</p>}
        </div>

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <div className="bg-[#0F1629] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <h3 className="text-lg text-white font-semibold">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h3>
                <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-white/[0.06] text-gray-400"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                {error && <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ k: 'name', l: 'Name' }, { k: 'brand', l: 'Brand' }].map(({ k, l }) => (
                    <div key={k}><label className="block text-xs text-gray-500 mb-1">{l}</label><input type='text' value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50" /></div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Upload Image</label>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-gray-300 text-sm cursor-pointer hover:bg-white/[0.06]">
                      <Upload size={14} />
                      {uploadingImage ? 'Uploading...' : 'Choose image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { if (e.target.files?.[0]) handleFormImageUpload(e.target.files[0]); }}
                      />
                    </label>
                  </div>
                  <div><label className="block text-xs text-gray-500 mb-1">Category</label><select value={form.categoryId || ''} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50"><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Status</label><select value={form.statusActiveInd || 'Y'} onChange={e => setForm({ ...form, statusActiveInd: e.target.value })} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50"><option value="Y">Active</option><option value="N">Inactive</option></select></div>
                </div>

                {/* Variants Section */}
                <div className="border border-white/[0.08] rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm text-white font-medium">Variants</h4>
                    <button onClick={() => setForm({ ...form, variants: [...(form.variants || []), { flavor: '', netQuantity: '', mrp: '', finalPrice: '', stock: 0 }] })} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"><Plus size={12} />Add Variant</button>
                  </div>
                  {(form.variants || []).map((v, i) => (
                    <div key={i} className="flex flex-wrap items-end gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                      <div className="flex-1 min-w-[120px]"><label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Flavor</label><input type="text" value={v.flavor} onChange={e => { const nv = [...form.variants]; nv[i].flavor = e.target.value; setForm({ ...form, variants: nv }) }} className="w-full px-2 py-1.5 bg-[#0F1629] border border-white/[0.08] rounded-md text-white text-xs" /></div>
                      <div className="flex-1 min-w-[100px]"><label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Size/Qty</label><input type="text" value={v.netQuantity} onChange={e => { const nv = [...form.variants]; nv[i].netQuantity = e.target.value; setForm({ ...form, variants: nv }) }} className="w-full px-2 py-1.5 bg-[#0F1629] border border-white/[0.08] rounded-md text-white text-xs" /></div>
                      <div className="w-20"><label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">MRP</label><input type="number" value={v.mrp} onChange={e => { const nv = [...form.variants]; nv[i].mrp = e.target.value; setForm({ ...form, variants: nv }) }} className="w-full px-2 py-1.5 bg-[#0F1629] border border-white/[0.08] rounded-md text-white text-xs" /></div>
                      <div className="w-20"><label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Price</label><input type="number" value={v.finalPrice} onChange={e => { const nv = [...form.variants]; nv[i].finalPrice = e.target.value; setForm({ ...form, variants: nv }) }} className="w-full px-2 py-1.5 bg-[#0F1629] border border-white/[0.08] rounded-md text-white text-xs" /></div>
                      <div className="w-20"><label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Stock</label><input type="number" value={v.stock} onChange={e => { const nv = [...form.variants]; nv[i].stock = e.target.value; setForm({ ...form, variants: nv }) }} className="w-full px-2 py-1.5 bg-[#0F1629] border border-white/[0.08] rounded-md text-white text-xs" /></div>
                      {form.variants.length > 1 && <button onClick={() => { const nv = [...form.variants]; nv.splice(i, 1); setForm({ ...form, variants: nv }) }} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors mb-0.5"><Trash2 size={14} /></button>}
                    </div>
                  ))}
                </div>

                {[{ k: 'description', l: 'Description' }, { k: 'ingredients', l: 'Ingredients' }, { k: 'nutritionFacts', l: 'Nutrition Facts' }, { k: 'recommendedUsage', l: 'Recommended Usage' }, { k: 'warning', l: 'Warning' }].map(({ k, l }) => (
                  <div key={k}><label className="block text-xs text-gray-500 mb-1">{l}</label><textarea value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 resize-none" /></div>
                ))}
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-white/[0.06]">
                <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default AdminProductsPage;