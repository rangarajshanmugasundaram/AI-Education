import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordCard = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword && password.length >= 6) {
      alert("Password reset successful!");
      navigate('/login');
    } else {
      alert("Passwords do not match or are too short.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '420px' }} className="w-full p-8 bg-white/95 rounded-3xl border border-slate-100 shadow-xl flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Set New Password</h2>
      </div>
      
      <input 
        type="password" placeholder="New Password" required
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
        value={password} onChange={(e) => setPassword(e.target.value)}
      />
      
      <input 
        type="password" placeholder="Confirm Password" required
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button type="submit" className="w-full p-4 bg-blue-600 text-white font-semibold rounded-xl">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPasswordCard;