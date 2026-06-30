import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const RegisterCard = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({ pass: false, conf: false });

  const validate = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = "First name required";
    if (!form.lastName.trim()) err.lastName = "Last name required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Invalid email";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password)) 
      err.password = "Must be 8+ chars, upper, lower, digit & special";
    if (form.confirm !== form.password) err.confirm = "Passwords do not match";
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const strength = useMemo(() => {
    if (!form.password) return { label: '', color: 'bg-slate-200' };
    if (form.password.length < 8) return { label: 'Weak', color: 'bg-red-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  }, [form.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  return (
    <form className="w-full max-w-[420px] p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-4" 
          onSubmit={(e) => { e.preventDefault(); validate(); }}>
      
      <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>

      <Input label="First Name" name="firstName" value={form.firstName} error={errors.firstName} onChange={handleChange} />
      <Input label="Last Name" name="lastName" value={form.lastName} error={errors.lastName} onChange={handleChange} />
      <Input label="Email Address" name="email" value={form.email} error={errors.email} onChange={handleChange} type="email" />

      <PasswordInput label="Password" name="password" value={form.password} error={errors.password} show={show.pass} toggle={() => setShow(p => ({...p, pass: !p.pass}))} onChange={handleChange} />
      <div className={`h-1 rounded-full transition-all ${strength.color}`} style={{ width: form.password ? '100%' : '0%' }} />
      <span className="text-[10px] text-slate-500">{strength.label}</span>

      <PasswordInput label="Confirm Password" name="confirm" value={form.confirm} error={errors.confirm} show={show.conf} toggle={() => setShow(p => ({...p, conf: !p.conf}))} onChange={handleChange} />

      <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">Register</button>
      
      <p className="text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
      </p>
    </form>
  );
};

const Input = ({ label, name, value, error, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-700">{label}</label>
    <input name={name} value={value} onChange={onChange} type={type} 
           className={`p-3 rounded-xl border ${error ? 'border-red-500' : 'border-slate-200'} outline-none focus:border-blue-500`} />
    {error && <span className="text-red-500 text-[10px]">{error}</span>}
  </div>
);

const PasswordInput = ({ label, name, value, error, show, toggle, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-700">{label}</label>
    <div className="relative">
      <input name={name} value={value} onChange={onChange} type={show ? 'text' : 'password'} 
             className={`w-full p-3 rounded-xl border ${error ? 'border-red-500' : 'border-slate-200'} outline-none focus:border-blue-500`} />
      <button type="button" onClick={toggle} className="absolute right-3 top-3.5 text-xs font-bold text-blue-600">{show ? 'Hide' : 'Show'}</button>
    </div>
    {error && <span className="text-red-500 text-[10px]">{error}</span>}
  </div>
);

export default RegisterCard;