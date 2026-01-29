import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Inventory() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('General');
  const [stock, setStock] = useState(0);
  const [products, setProducts] = useState([]);
  const [revenue, setRevenue] = useState(0); 
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

const fetchData = async () => {
  try {
    const prodRes = await axios.get('https://shopmate-pos.vercel.app/api/products/all');
    setProducts(prodRes.data);
    
    const revRes = await axios.get('https://shopmate-pos.vercel.app/api/sales/today_detailed');
    
    if (revRes.data && revRes.data.totalRevenue !== undefined) {
      setRevenue(revRes.data.totalRevenue);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (Number(price) < 0 || Number(stock) < 0) {
      alert("Price or Stock must be positive!");
      return;
    }

    try {
      if (editId) {
        await axios.put(`https://shopmate-pos.vercel.app/api/products/${editId}`, { name, price, category, stock });
        setEditId(null);
        alert("Product updated Successfully!");
      } else {
        await axios.post('https://shopmate-pos.vercel.app/api/products/add', { name, price, category, stock });
        alert("Product added Successfully!");
      }
      setName(''); setPrice(''); setStock(0); setCategory('General');
      fetchData();
    } catch (err) {
      alert("Saving error!");
    }
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setName(p.name);
    setPrice(p.price);
    setCategory(p.category);
    setStock(p.stock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setName(''); setPrice(''); setStock(0); setCategory('General');
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      try {
        await axios.delete(`https://shopmate-pos.vercel.app/api/products/${id}`);
        fetchData();
      } catch (err) {
        alert("Fail to Delete this product");
      }
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- STATS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-blue-600">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Products</p>
            <p className="text-3xl font-black text-slate-800">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-orange-500">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Inventory Value</p>
            <p className="text-3xl font-black text-slate-800">Rs. {products.reduce((acc, p) => acc + (p.price * p.stock), 0)}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-green-600">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Today's Revenue 💰</p>
            <p className="text-3xl font-black text-green-700">Rs. {revenue}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- FORM SECTION --- */}
          <div className="lg:col-span-1">
            <div className={`p-8 rounded-[2.5rem] shadow-xl border transition-all sticky top-8 ${editId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-100'}`}>
              <h2 className="text-2xl font-black mb-8 text-slate-800">{editId ? '✏️ Edit Item' : '➕ Add Item'}</h2>
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Product Name</label>
                  <input type="text" value={name} className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500" onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price</label>
                    <input type="number" min="0" value={price} className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500" onChange={(e) => setPrice(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Stock</label>
                    <input type="number" min="0" value={stock} className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500" onChange={(e) => setStock(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
                  <select value={category} className="w-full p-4 border-2 rounded-2xl outline-none bg-white focus:border-blue-500 font-bold" onChange={(e) => setCategory(e.target.value)}>
                    <option value="General">General</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                </div>
                <button type="submit" className={`w-full py-5 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${editId ? 'bg-yellow-600' : 'bg-blue-700'}`}>
                  {editId ? 'UPDATE PRODUCT' : 'SAVE TO INVENTORY'}
                </button>
                {editId && <button type="button" onClick={cancelEdit} className="w-full text-sm text-slate-400 font-bold mt-2">× CANCEL</button>}
              </form>
            </div>
          </div>

          {/* --- LIST SECTION --- */}
          <div className="lg:col-span-2 space-y-4">
            <input 
              type="text" 
              placeholder="🔍 Search inventory..." 
              className="w-full p-5 bg-white rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Desktop Table View (Visible on screens larger than 768px) */}
            <div className="hidden md:block bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100 text-xs font-black text-slate-600 uppercase tracking-widest">
                    <th className="p-6">Product Details</th>
                    <th className="p-6">Price</th>
                    <th className="p-6 text-center">Stock</th>
                    <th className="p-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-6">
                        <p className="font-bold text-slate-800 text-lg">{p.name}</p>
                        <p className="text-[10px] font-black text-blue-500 uppercase">{p.category}</p>
                      </td>
                      <td className="p-6 font-black text-slate-700 text-lg">Rs. {p.price}</td>
                      <td className="p-6 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-6 text-center space-x-4">
                        <button onClick={() => startEdit(p)} className="text-blue-600 font-black text-[10px] uppercase hover:underline">Edit</button>
                        <button onClick={() => deleteProduct(p._id)} className="text-red-400 font-black text-[10px] uppercase hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Visible on screens smaller than 768px, perfect for 320px) */}
            <div className="md:hidden space-y-4">
              {filteredProducts.map((p) => (
                <div key={p._id} className="bg-white p-6 rounded-4xl shadow-md border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-slate-800 text-lg leading-tight">{p.name}</h3>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase">{p.category}</span>
                    </div>
                    <p className="font-black text-blue-700 text-xl">Rs. {p.price}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      Stock: {p.stock}
                    </span>
                    <div className="flex gap-4">
                      <button onClick={() => startEdit(p)} className="text-blue-600 font-black text-xs uppercase underline">Edit</button>
                      <button onClick={() => deleteProduct(p._id)} className="text-red-500 font-black text-xs uppercase underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}