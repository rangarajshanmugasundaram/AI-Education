import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './auth/authService';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({ 
        email: email.trim().toLowerCase(), 
        password: password.trim() 
      });
      
      console.log("Login Success Full Response:", response);
      
      const responseData = response?.data || response;
      
      const userRole = responseData?.role || "Student";
      const token = responseData?.token || "";
      
      console.log("Extracted Role:", userRole);
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("token", token);
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      if (userRole === 'Trainer' || userRole === 'Admin') {
        navigate('/'); 
      } else {
        navigate('/digital-classroom'); 
      }

    } catch (err) {
      console.error("Login failed error details:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Invalid credentials. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleLogin} 
      style={{ maxWidth: '420px' }}
      className="w-full p-12 bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)] flex flex-col gap-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-[15px]">Sign in to your AI learning hub</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-600">Email Address</label>
        <input 
          type="email" 
          placeholder="Enter your email" 
          required 
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-[15px] outline-none transition-all duration-300 focus:border-blue-500"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label className="text-xs font-semibold text-slate-600">Password</label>
          <Link to="/forgot-password" className="text-blue-600 text-xs font-semibold hover:underline">Forgot?</Link>
        </div>
        <input 
          type="password" 
          placeholder="Enter your password" 
          required 
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-[15px] outline-none transition-all duration-300 focus:border-blue-500"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="rememberMe"
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">Remember me</label>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{ background: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)',}}
        className="mt-2 p-4 w-full rounded-xl text-base font-semibold text-white cursor-pointer transition-all duration-200 hover:shadow-lg active:opacity-90 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      
      <p className="text-center text-sm text-slate-500">
        New here? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create an account</Link>
      </p>
    </form>
  );
};

export default LoginCard;