import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [todaySales, setTodaySales] = useState([]);

  // Data fetch karne ka function
  const fetchData = async () => {
    try {
      const prodRes = await axios.get('https://shopmate-backend.vercel.app/api/products/all');
      setProducts(prodRes.data);

      const salesRes = await axios.get('https://shopmate-backend.vercel.app/api/sales/today_detailed');
      setTodaySales(salesRes.data.sales || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = (p) => {
    if (p.stock <= 0) {
      alert("We’re sorry! This item is currently out of stock.");
      return;
    }

    const exists = cart.find(item => item._id === p._id);
    if (exists) {
      if (exists.qty >= p.stock) {
        alert(`Only ${p.stock} items are available in stock!`);
        return;
      }
      setCart(cart.map(item => item._id === p._id ? { ...exists, qty: exists.qty + 1 } : item));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  };

  const updateQty = (id, val) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        const newQty = item.qty + val;
        if (val > 0 && newQty > item.stock) {
          alert("There is no more stock available than this!");
          return item;
        }
        return { ...item, qty: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  // --- ITEM CANCEL/REMOVE KARNE KA FUNCTION ---
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Please select some items first!");
    
    try {
      await axios.post('https://shopmate-backend.vercel.app/api/sales/add', {
        items: cart.map(i => ({ productId: i._id, name: i.name, qty: i.qty, price: i.price })),
        totalAmount: subTotal
      });

      for (const item of cart) {
        await axios.put(`https://shopmate-backend.vercel.app/api/products/${item._id}`, { 
          stock: item.stock - item.qty 
        });
      }

      alert("Payment successfull!");
      setCart([]);
      fetchData(); 
    } catch (err) {
      alert("There was an issue during checkout.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      
      {/* SECTION 1: POS Counter & Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">POS Counter 🛒</h2>
            <div className="relative w-full md:w-72">
              <input 
                type="text" 
                placeholder="Search items..." 
                className="w-full p-3 pl-10 border-2 border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm"
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-3.5 opacity-30">🔍</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-125 p-2">
            {filteredProducts.map(p => (
              <div 
                key={p._id} 
                onClick={() => addToCart(p)}
                className={`bg-white p-5 rounded-3xl shadow-sm border-2 transition-all cursor-pointer flex flex-col justify-between h-40 ${
                  p.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-blue-500 hover:shadow-xl active:scale-95 border-transparent'
                }`}
              >
                <div>
                  <h3 className="font-bold text-slate-700 text-lg leading-tight mb-1">{p.name}</h3>
                  <p className="text-blue-700 font-black text-2xl">Rs. {p.price}</p>
                </div>
                <div className="flex justify-between items-center mt-2 border-t pt-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                    STOCK: {p.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Order Summary / Shopping Cart */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col h-150 sticky top-8">
          <div className="p-8 border-b flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800">Current Bill 🧾</h2>
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">{cart.length} Items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-slate-400 font-medium italic">Cart is Empty...</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-blue-600 font-bold">Rs. {item.price} × {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white rounded-xl border shadow-sm">
                      <button onClick={() => updateQty(item._id, -1)} className="px-3 py-1 hover:bg-red-50 text-red-500 font-bold">-</button>
                      <span className="px-1 font-black text-slate-700 text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, 1)} className="px-3 py-1 hover:bg-green-50 text-green-600 font-bold">+</button>
                    </div>
                    
                    {/* CANCEL/REMOVE BUTTON */}
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <span className="text-lg font-bold">×</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-8 bg-slate-50 border-t rounded-b-[2.5rem]">
            <div className="flex justify-between text-2xl font-black text-slate-900 mb-6">
              <span>Total:</span>
              <span className="text-green-700">Rs. {subTotal}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 text-white py-4 rounded-2xl font-bold transition-all active:scale-95"
            >
              CONFIRM & PAY
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Today's Sales Record Table */}
      <div className="bg-white rounded-4xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-800 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Today's Sales Record 📜</h2>
          <span className="text-sm font-bold text-slate-400 italic">Recent sales first</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Time</th>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest">Items Sold</th>
                <th className="p-5 font-bold text-slate-600 text-xs uppercase tracking-widest text-right">Total Bill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todaySales.slice().reverse().map((sale, index) => (
                <tr key={index} className="hover:bg-blue-50/20">
                  <td className="p-5 text-slate-500 font-medium">
                    {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {sale.items.map((it, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-lg font-black border border-blue-200">
                          {it.name} (x{it.qty})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5 text-right font-black text-slate-800 text-lg">
                    Rs. {sale.totalAmount}
                  </td>
                </tr>
              ))}
              {todaySales.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-16 text-center text-slate-400 font-medium italic">
                    No sales have been made so far today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}