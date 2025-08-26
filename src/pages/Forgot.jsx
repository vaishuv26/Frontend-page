import s from '../styles/auth.module.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API + '/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) toast.success('OTP sent to your email');
      else toast.error(data.message || 'Failed to send OTP');
    } catch {
      toast.error('Network error');
    }

    setLoading(false);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.panel}>
        <div className={s.cardAuth}>
          <h2 className={s.title}>Forgot Password</h2>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div style={{ height: 12 }} />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
          <div className="small" style={{ marginTop: 8 }}>
            <Link to="/reset">Already have OTP?</Link>
          </div>
        </div>
      </div>
      <div className={s.panel + ' ' + s.illu}>
        <img src="/illustrations/login.svg" alt="Illustration" />
      </div>
    </div>
  );
}
