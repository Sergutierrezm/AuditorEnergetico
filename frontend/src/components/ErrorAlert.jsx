import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message }) {
  if (!message) return null;
  
  return (
    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '16px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '35px' }}>
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );
}