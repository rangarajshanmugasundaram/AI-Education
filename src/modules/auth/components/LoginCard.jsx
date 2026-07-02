import React, { useState } from 'react';
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
      const response = await loginUser({ email, password });
      console.log("Login Success:", response);
      
      // Store session status
      localStorage.setItem("isLoggedIn", "true");
      
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      navigate('/');
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleLogin} 
      className="w-full max-w-[420px] p-12 bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)] flex flex-col gap-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-[15px]">Sign in to your AI learning hub</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-600">Email Address</label>
        <input 
          type="email" 
          placeholder="student@ai.edu" 
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
          placeholder="password123" 
          required 
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-[15px] outline-none transition-all duration-300 focus:border-blue-500"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label className="text-sm text-slate-600 cursor-pointer">Remember me</label>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full mt-2 p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl text-base font-semibold cursor-pointer transition-transform duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
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