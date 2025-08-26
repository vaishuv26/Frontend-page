import s from '../styles/auth.module.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Account created');
        nav('/');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.panel}>
        <div className={s.cardAuth}>
          <h2 className={s.title}>Create Account</h2>
          <form onSubmit={onSubmit}>
            <input
              className="input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ height: 8 }} />
            <input
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div style={{ height: 8 }} />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={{ height: 12 }} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </form>
          <div className="small" style={{ marginTop: 8 }}>
            <Link to="/login">Back to login</Link>
          </div>
        </div>
      </div>
      <div className={`${s.panel} ${s.illu}`}>
        <img src="/illustrations/login.svg" alt="Illustration" />
      </div>
    </div>
  );
}
