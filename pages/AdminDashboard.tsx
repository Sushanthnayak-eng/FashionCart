
import React, { useState, useMemo, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../db/firebase';
import { useProducts } from '../context/ProductContext';
import { Category, AgeGroup, Order } from '../types';

const AdminDashboard: React.FC = () => {
  const { products, orders, addProduct, updateProduct } = useProducts();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add' | 'stats'>('products');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Loading States
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: 'Men' as Category,
    ageGroup: 'Adults' as AgeGroup,
    imageUrl: '',
    imageFile: null as File | null
  });

  // Edit State
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: 'Men' as Category,
    ageGroup: 'Adults' as AgeGroup,
    imageUrl: '',
    imageFile: null as File | null
  });

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData(prev => ({ ...prev, imageFile: file, imageUrl: URL.createObjectURL(file) }));
    }
  };

  // Upload function
  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageFile && !formData.imageUrl) {
      alert('Please select a product image.');
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (formData.imageFile) {
        finalImageUrl = await uploadImage(formData.imageFile);
      }

      await addProduct({
        name: formData.name,
        price: formData.price,
        description: formData.description,
        category: formData.category,
        ageGroup: formData.ageGroup,
        imageUrl: finalImageUrl
      });

      setFormData({ name: '', price: 0, description: '', category: 'Men', ageGroup: 'Adults', imageUrl: '', imageFile: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setActiveTab('products');
      alert('Product Added Successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditProductId(product.id);
    setEditFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      ageGroup: product.ageGroup,
      imageUrl: product.imageUrl,
      imageFile: null
    });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductId) return;

    setSaving(true);
    try {
      let finalImageUrl = editFormData.imageUrl;
      if (editFormData.imageFile) {
        finalImageUrl = await uploadImage(editFormData.imageFile);
      }

      await updateProduct(editProductId, {
        name: editFormData.name,
        price: editFormData.price,
        description: editFormData.description,
        category: editFormData.category,
        ageGroup: editFormData.ageGroup,
        imageUrl: finalImageUrl
      });

      setEditProductId(null);
      alert('Product updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.total || 0), 0), [orders]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
          <p className="text-gray-500">Manage your fashion store inventory and sales</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-pink-100 text-pink-700 px-4 py-2 rounded-xl text-sm font-bold uppercase border border-pink-200">
            Store Status: Live
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="bg-pink-500" />
        <StatCard title="Total Sales" value={orders.length.toString()} color="bg-indigo-500" />
        <StatCard title="Active Listings" value={products.length.toString()} color="bg-emerald-500" />
        <StatCard title="Orders Pending" value={orders.filter(o => o.status === 'Paid').length.toString()} color="bg-amber-500" />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8 space-x-8 overflow-x-auto">
        <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} label="Inventory" />
        <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label={`Orders Notification (${orders.length})`} />
        <TabButton active={activeTab === 'add'} onClick={() => setActiveTab('add')} label="Add New Dress" />
      </div>

      {/* Inventory Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-5 font-bold text-gray-600 text-xs uppercase tracking-widest">Product Info</th>
                <th className="p-5 font-bold text-gray-600 text-xs uppercase tracking-widest">Category</th>
                <th className="p-5 font-bold text-gray-600 text-xs uppercase tracking-widest">Pricing</th>
                <th className="p-5 font-bold text-gray-600 text-xs uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="p-5 flex items-center space-x-4">
                    <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100" />
                    <div>
                      <div className="font-bold text-gray-900">{p.name}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">{p.ageGroup}</div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">{p.category}</span>
                  </td>
                  <td className="p-5 font-bold text-gray-900">₹{p.price}</td>
                  <td className="p-5 text-right">
                    <button onClick={() => handleEdit(p)} className="text-pink-600 hover:bg-pink-50 p-2 rounded-lg transition">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editProductId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
              <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                <button onClick={() => setEditProductId(null)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 text-2xl font-bold">&times;</button>
                <h2 className="text-2xl font-black mb-6 text-pink-600">Edit Product</h2>
                <form onSubmit={handleEditSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                      <input value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                      <input type="number" value={editFormData.price} onChange={e => setEditFormData({ ...editFormData, price: Number(e.target.value) })} className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                      <select value={editFormData.category} onChange={e => setEditFormData({ ...editFormData, category: e.target.value as Category })} className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none">
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Age Group</label>
                      <select value={editFormData.ageGroup} onChange={e => setEditFormData({ ...editFormData, ageGroup: e.target.value as AgeGroup })} className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none">
                        <option value="Adults">Adults</option>
                        <option value="Teens">Teens</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                    <textarea value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none h-20" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Product Photo</label>
                    <div className="flex items-center space-x-4">
                      <input type="file" accept="image/*" onChange={handleEditImageChange} className="text-sm" ref={editFileInputRef} />
                      {editFormData.imageUrl && (
                        <img src={editFormData.imageUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={() => setEditProductId(null)} className="px-6 py-2 rounded-xl border border-gray-200 bg-white text-gray-500 font-bold hover:text-pink-600 hover:border-pink-200 transition">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-pink-600 text-white font-bold shadow hover:bg-pink-700 transition disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(o => (
            <div key={o.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">{o.id}</h3>
                  <p className="text-pink-600 text-sm font-bold">{o.userEmail}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${o.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    Status: {o.status}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-2">{o.createdAt}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Items Ordered</p>
                {o.items?.map((item, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex justify-between py-1 border-b border-gray-100 last:border-0">
                    <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {o.address && (
                <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 mb-6">
                  <p className="text-xs font-bold text-pink-400 mb-2 uppercase flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                    Delivery Destination
                  </p>
                  <p className="text-sm font-black text-gray-900">{o.address.fullName}</p>
                  <p className="text-xs text-gray-600 mt-1">{o.address.street}, {o.address.city}</p>
                  <p className="text-xs text-gray-600">{o.address.state} - {o.address.pincode}</p>
                  <p className="text-xs font-bold text-gray-900 mt-2">📞 {o.address.phone}</p>
                </div>
              )}

              <div className="flex justify-between items-center font-bold text-xl border-t pt-4">
                <span className="text-gray-500">Order Total</span>
                <span className="text-pink-600">₹{o.total}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="col-span-2 text-center py-20 text-gray-400">No orders received yet.</p>}
        </div>
      )}

      {/* Add Product Tab */}
      {activeTab === 'add' && (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 bg-white p-8 rounded-3xl border shadow-sm">
            <h2 className="text-2xl font-black mb-8">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Dress Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-500 transition-colors outline-none" placeholder="e.g. Elegant Summer Maxi" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Department</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as Category })} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Detailed Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-500 outline-none h-24" placeholder="Fabric, fit, and style details..."></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-tighter">1. Upload Product Photo</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-all group"
                >
                  <svg className="w-10 h-10 text-gray-300 group-hover:text-pink-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  <p className="text-sm text-gray-400 group-hover:text-pink-500">{formData.imageFile ? formData.imageFile.name : 'Click to select a file'}</p>
                  <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
                </div>
              </div>

              <button disabled={saving} type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-black transition shadow-xl transform active:scale-[0.98] disabled:opacity-50">
                {saving ? 'Processing...' : 'List Product Now'}
              </button>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="md:w-1/2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-6">Product Preview</h2>
              {formData.imageUrl ? (
                <div className="space-y-6">
                  <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                    <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{formData.name || 'Your Dress Name'}</h3>
                    <p className="text-pink-600 font-bold text-xl">₹{formData.price || '0'}</p>
                    <p className="text-gray-500 mt-2 text-sm">{formData.description || 'Description will appear here...'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                  <div className="w-20 h-20 border-4 border-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <p className="font-bold">No photo uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition">
    <div className="flex justify-between items-center mb-4">
      <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{title}</span>
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
    </div>
    <div className="text-2xl font-black text-gray-900 group-hover:text-pink-600 transition tracking-tighter">{value}</div>
  </div>
);

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className={`pb-4 px-2 font-bold transition whitespace-nowrap text-sm uppercase tracking-tighter ${active ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-400'}`}
  >
    {label}
  </button>
);

export default AdminDashboard;
