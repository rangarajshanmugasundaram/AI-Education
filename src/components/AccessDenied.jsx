import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-3xl mb-6 shadow-sm">
        🚫
      </div>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
        Access Denied
      </h1>
      <p className="text-slate-500 max-w-md text-[15px] leading-relaxed mb-8">
        You don't have permission to view this page. Please log in with valid credentials.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md shadow-slate-900/10 cursor-pointer"
      >
        Go to Login
      </button>
    </div>
  );
};

export default AccessDenied;