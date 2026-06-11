import React from 'react';
import { Activity, DollarSign, Percent } from 'lucide-react';

export default function KpiCards({ totales }) {
  if (!totales) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
      
      {/* Consumo */}
      <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ backgroundColor: '#dcfce7', padding: '12px', borderRadius: '10px', color: '#166534' }}><Activity size={24} /></div>
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534', fontWeight: '500' }}>Consumo Anual</p>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '700' }}>{totales.consumo_anual_kwh.toLocaleString('es-ES')} <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>kWh</span></h3>
        </div>
      </div>

      {/* Gasto */}
      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '10px', color: '#1e40af' }}><DollarSign size={24} /></div>
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af', fontWeight: '500' }}>Gasto Anual</p>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '700' }}>{totales.gasto_anual_euros.toLocaleString('es-ES', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>€</span></h3>
        </div>
      </div>

      {/* Precio Medio */}
      <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ backgroundColor: '#ffedd5', padding: '12px', borderRadius: '10px', color: '#9a3412' }}><Percent size={24} /></div>
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#9a3412', fontWeight: '500' }}>Precio Medio</p>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '700' }}>{totales.precio_medio_kwh} <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>€/kWh</span></h3>
        </div>
      </div>

    </div>
  );
}