import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Inventory from './pages/Inventory'; 
import Billing from './pages/Billing';     
import Login from './pages/Login'; 

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login'; 
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        
        {/* --- NAVBAR START --- */}
        {/* Navbar sirf tab dikhega jab user login ho */}
        {isLoggedIn && (
          <nav className="bg-blue-800 text-white p-4 shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-black italic tracking-tighter">ShopMate POS 🛒</h1>
              
              <div className="flex gap-4 md:gap-8 items-center">
                <Link to="/" className="text-sm hover:text-blue-200 font-bold transition-all uppercase tracking-wide">
                  Inventory
                </Link>
                
                <Link to="/billing" className="text-sm bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700 font-black shadow-md transition-all">
                  POS Counter 🧾
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="text-[10px] border border-blue-400 px-3 py-1 rounded-lg hover:bg-red-500 hover:border-red-500 transition-all font-bold uppercase"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}
        {/* --- NAVBAR END --- */}

        {/* --- PAGES START --- */}
        <div className="w-full">
          <Routes>
            {/* Login Route: Agar pehle se login hai toh billing par bhej do */}
            <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/billing" />} />
            
            {/* Protected Routes: Bina login ke koi yahan nahi ja sakta */}
            <Route path="/" element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto pt-6"><Inventory /></div>
              </ProtectedRoute>
            } />
            
            <Route path="/billing" element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto pt-6"><Billing /></div>
              </ProtectedRoute>
            } />

            {/* Default Route: Agar koi galat address likhe */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/billing" : "/login"} />} />
          </Routes>
        </div>
        {/* --- PAGES END --- */}

      </div>
    </Router>
  );
}

export default App;