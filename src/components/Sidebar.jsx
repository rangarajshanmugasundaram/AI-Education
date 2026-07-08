import { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ toggleMobileMenu, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (toggleMobileMenu) toggleMobileMenu();
  };

  return (
    <>
      {/* NON-BLUR MOBILE BACKDROP:
        Only darkens the background slightly. Removed 'backdrop-blur' 
        to ensure no blur is applied to the main content.
      */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 md:hidden transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - Now strictly defined for mobile */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#E0F2FE] z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 border-r border-blue-200/50 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-[70px] items-center justify-between px-5 border-b border-blue-200/50 shrink-0 bg-[#F0F9FF]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">AI</div>
            <span className="text-sm font-bold text-blue-950">AI Education</span>
          </div>
          <button onClick={toggleMobileMenu} className="md:hidden p-2 text-blue-500">✕</button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1.5">
          <div className="mb-2.5 px-2.5 text-[10px] font-bold uppercase tracking-widest text-blue-500/80">
            Workspace
          </div>
          
          {[
            { path: '/', label: 'Dashboard', icon: '📊' },
            { path: '/digital-classroom', label: 'Digital Classroom', icon: '🏫' },
            { path: '/session-recordings', label: 'Session Recordings', icon: '📹' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-all ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-blue-700 hover:bg-blue-200/60'
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default memo(Sidebar);