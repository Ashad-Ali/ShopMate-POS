import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://shopmate-pos.vercel.app/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token); // Token save karein
      alert("Login Successfull!");
      navigate('/billing'); // Login ke baad kahan jana hai
      window.location.reload(); // Navbar update karne ke liye
    } catch (err) {
      alert("Login failed! Please Check your Credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        <h2 className="text-4xl font-black text-slate-800 mb-8 text-center">Admin Login 🔒</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Username</label>
            <input type="text" className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500" onChange={(e)=>setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Password</label>
            <input type="password" className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500" onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-blue-800 transition-all active:scale-95">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}