import s from '../styles/auth.module.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Reset() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (res.ok && data.message) {
        toast.success('Password reset successfully');
        nav('/login');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.panel}>
        <div className={s.cardAuth}>
          <h2 className={s.title}>Reset Password</h2>
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
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoComplete="one-time-code"
            />
            <div style={{ height: 8 }} />
            <input
              className="input"
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <div style={{ height: 12 }} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset'}
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
