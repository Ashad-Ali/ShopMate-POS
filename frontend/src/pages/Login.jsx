import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Demo Credentials
  const demoUser = "admin";
  const demoPass = "admin123";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://shopmate-pos.vercel.app/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      alert("Login Successfull!");
      navigate('/billing');
      window.location.reload();
    } catch (err) {
      alert("Login failed! Please Check your Credentials.");
    }
  };

  // Auto-fill function for teacher's ease
  const fillDemoCredentials = () => {
    setUsername(demoUser);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        <h2 className="text-4xl font-black text-slate-800 mb-8 text-center">Admin Login 🔒</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Username</label>
            <input 
              type="text" 
              value={username} // Added value for auto-fill
              className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500" 
              onChange={(e)=>setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Password</label>
            <input 
              type="password" 
              value={password} // Added value for auto-fill
              className="w-full p-4 border-2 rounded-2xl outline-none focus:border-blue-500" 
              onChange={(e)=>setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-blue-800 transition-all active:scale-95">
            Log in
          </button>
        </form>

        {/* --- Default Credentials Display --- */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-dashed border-blue-300">
          <p className="text-[10px] font-black uppercase text-blue-400 mb-2 tracking-widest text-center">Demo Access</p>
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              <p>User: <strong>{demoUser}</strong></p>
              <p>Pass: <strong>{demoPass}</strong></p>
            </div>
            <button 
              onClick={fillDemoCredentials}
              className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-blue-700 active:scale-90 transition-all"
            >
              Auto Fill
            </button>
          </div>
        </div>
        {/* ----------------------------------- */}

      </div>
    </div>
  );
}