import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "student@ai.edu" && password === "password123") {
      localStorage.setItem("isLoggedIn", "true");
      navigate('/');
    } else {
      alert("Invalid credentials.");
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.card}>
      <div style={styles.headerArea}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your AI learning hub</p>
      </div>
      
      <div style={styles.inputGroup}>
        <label style={styles.label}>Email Address</label>
        <input 
          type="email" placeholder="student@ai.edu" required 
          style={styles.input}
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={styles.inputGroup}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={styles.label}>Password</label>
          <a href="/forgot" style={styles.link}>Forgot?</a>
        </div>
        <input 
          type="password" placeholder="password123" required 
          style={styles.input}
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <button type="submit" style={styles.button}>Sign In</button>
      
      <p style={styles.footer}>
        New here? <a href="/register" style={styles.link}>Create an account</a>
      </p>
    </form>
  );
};

const styles = {
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '48px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  headerArea: { textAlign: 'center', marginBottom: '8px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' },
  subtitle: { color: '#64748b', margin: 0, fontSize: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569' },
  input: {
    width: '100%',
    padding: '14px 18px',
    backgroundColor: '#f8fafc',
    border: '2px solid #f1f5f9',
    borderRadius: '12px',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  link: { color: '#2563eb', textDecoration: 'none', fontSize: '13px', fontWeight: '600' },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  footer: { textAlign: 'center', fontSize: '14px', color: '#64748b' }
};

styles.input[':focus'] = { borderColor: '#2563eb' };

export default LoginCard;