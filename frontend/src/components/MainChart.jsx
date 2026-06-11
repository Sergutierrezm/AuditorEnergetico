import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MainChart({ consumo, gasto }) {
  if (!consumo || !gasto) return null;

  // Preparar los datos mapeando los tramos (PUNTA, LLANO, VALLE)
  const datosGrafico = Object.keys(consumo).map(tramo => ({
    name: tramo,
    'Consumo (kWh)': consumo[tramo],
    'Gasto (€)': gasto[tramo]
  }));

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', fontWeight: '700', color: '#374151' }}>Análisis Comparativo por Tramos Horarios</h2>
      
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#6b7280" fontStyle={{ fontWeight: '500' }} />
            <YAxis yAxisId="left" orientation="left" stroke="#10b981" label={{ value: 'Consumo (kWh)', angle: -90, position: 'insideLeft', offset: -5, fill: '#10b981' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" label={{ value: 'Gasto (€)', angle: 90, position: 'insideRight', offset: 10, fill: '#3b82f6' }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="Consumo (kWh)" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="Gasto (€)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}