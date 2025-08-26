import s from '../styles/auth.module.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Logged in');
        nav('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.panel}>
        <div className={s.cardAuth}>
          <h2 className={s.title}>Login</h2>
          <form onSubmit={onSubmit}>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            <div style={{ height: 8 }} />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div style={{ height: 12 }} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="small" style={{ marginTop: 8 }}>
            <Link to="/signup">Create account</Link> ·{' '}
            <Link to="/forgot">Forgot password?</Link>
          </div>
        </div>
      </div>
      <div className={`${s.panel} ${s.illu}`}>
        <img src="/illustrations/login.svg" alt="Illustration" />
      </div>
    </div>
  );
}
