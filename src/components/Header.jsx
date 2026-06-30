import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-[1000] flex h-[70px] w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xl text-slate-600"
        >
          ☰
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <nav className="hidden md:flex text-xs font-medium text-slate-500 gap-1">
            Home <span className="text-slate-300">/</span> <span className="text-slate-600">Dashboard</span>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-lg">🔔</button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-lg">✉️</button>
        </div>
        
        <div className="relative cursor-pointer" onClick={() => { localStorage.removeItem("isLoggedIn"); navigate('/login'); }}>
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">RS</div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);