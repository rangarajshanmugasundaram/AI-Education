import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header 
      style={{ zIndex: 1000 }}
      className="sticky top-0 flex h-17.5 w-full items-center justify-between border-b border-blue-100 bg-[#F0F9FF] px-6 transition-colors duration-200"
    >
      
      {/* Left Block: Mobile Menu Button & Screen Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-white text-xl text-blue-600 hover:bg-blue-50 active:scale-95 transition-all"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg font-bold text-blue-950 tracking-tight">Dashboard</h1>
        </div>
      </div>

      {/* Right Block: Action Controls & User Identity */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-base shadow-sm shadow-blue-500/5 transition-all cursor-pointer">
            🔔
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-base shadow-sm shadow-blue-500/5 transition-all cursor-pointer">
            ✉️
          </button>
        </div>
        
        {/* Logout Profile Container */}
        <div 
          className="relative cursor-pointer group" 
          onClick={() => { localStorage.removeItem("isLoggedIn"); navigate('/login'); }}
          title="Logout"
        >
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/20 group-hover:bg-blue-700 active:scale-95 transition-all">
            RS
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#F0F9FF] bg-emerald-500"></span>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);