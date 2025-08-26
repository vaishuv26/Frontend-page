import s from '../styles/settings.module.css';
import React from 'react';
import { post } from '../lib/api.js';
import toast from 'react-hot-toast';

export default function Settings() {
  const reset = async () => {
    try {
      await post('/api/layout/home', { widgets: [] });
      await post('/api/layout/stats', { widgets: [] });
      toast.success('Layouts reset successfully');
    } catch (error) {
      toast.error('Failed to reset layouts');
    }
  };

  return (
    <div className={s.grid}>
      <div className={s.card} style={{ gridColumn: 'span 6' }}>
        <h3>Profile</h3>
        <div className="small">Profile editing UI stub.</div>
      </div>
      <div className={s.card} style={{ gridColumn: 'span 6' }}>
        <h3>Reset Layout</h3>
        <button className="btn danger" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
