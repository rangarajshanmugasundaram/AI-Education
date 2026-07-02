import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPasswordCard = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic email validation
    if (email.includes('@') && email.includes('.')) {
      alert("A reset link has been sent to your email!");
      navigate('/reset-password');
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[420px] p-8 bg-white/95 rounded-3xl border border-slate-100 shadow-xl flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
        <p className="text-slate-500 text-sm mt-2">Enter your email to receive a reset link.</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-600">Email Address</label>
        <input 
          type="email" 
          required 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button type="submit" className="w-full p-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">
        Send Reset Link
      </button>

      <Link to="/login" className="text-center text-sm text-blue-600 font-semibold hover:underline">Back to Login</Link>
    </form>
  );
};

export default ForgotPasswordCard;