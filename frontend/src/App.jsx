import React, { useState } from 'react';
import { Zap, Upload, FileText, RefreshCw, AlertCircle, DollarSign, Activity, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auditar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al procesar el archivo. Asegúrate de que el CSV es correcto.');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Preparar los datos del JSON para que Recharts los entienda
  const prepararDatosGrafico = () => {
    if (!data) return [];
    // Recorremos los tramos (PUNTA, LLANO, VALLE)
    return Object.keys(data.distribucion_consumo_kwh).map(tramo => ({
      name: tramo,
      'Consumo (kWh)': data.distribucion_consumo_kwh[tramo],
      'Gasto (€)': data.distribucion_gasto_euros[tramo]
    }));
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '30px', maxWidth: '1000px', margin: '0 auto', color: '#1f2937', backgroundColor: '#fff' }}>
      
      {/* Cabecera */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <Zap size={32} color="#eab308" fill="#eab308" />
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em' }}>Auditor Energético</h1>
      </header>
      <p style={{ color: '#4b5563', marginTop: 0, marginBottom: '30px', fontSize: '1.1rem' }}>
        Analiza el consumo por horas, calcula costes con la tarifa 2.0TD y descubre dónde optimizar.
      </p>

      <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', marginBottom: '30px' }} />

      <main>
        {/* Zona de Carga */}
        <section style={{ backgroundColor: '#f9fafb', border: '2px dashed #d1d5db', borderRadius: '12px', padding: '30px', textAlign: 'center', marginBottom: '35px' }}>
          <form onSubmit={handleUpload}>
            <Upload size={40} color="#9ca3af" style={{ marginBottom: '12px' }} />
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="csv-file" style={{ cursor: 'pointer', backgroundColor: '#ffffff', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                Seleccionar CSV de consumo
              </label>
              <input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>

            {file && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#2563eb', marginBottom: '15px', fontWeight: '500' }}>
                <FileText size={18} />
                <span>{file.name}</span>
              </div>
            )}

            <button type="submit" disabled={!file || loading} style={{ backgroundColor: !file || loading ? '#9ca3af' : '#2563eb', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: !file || loading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {loading ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Procesando 8.760 horas...' : 'Iniciar Auditoría'}
            </button>
          </form>
        </section>

        {/* Errores */}
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '16px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '35px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* DASHBOARD DE RESULTADOS */}
        {data && (
          <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            
            {/* Fila de Tarjetas KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
              
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#dcfce7', padding: '12px', borderRadius: '10px', color: '#166534' }}><Activity size={24} /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534', fontWeight: '500' }}>Consumo Anual</p>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '700' }}>{data.totales.consumo_anual_kwh.toLocaleString('es-ES')} <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>kWh</span></h3>
                </div>
              </div>

              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '10px', color: '#1e40af' }}><DollarSign size={24} /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af', fontWeight: '500' }}>Gasto Anual</p>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '700' }}>{data.totales.gasto_anual_euros.toLocaleString('es-ES', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>€</span></h3>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#ffedd5', padding: '12px', borderRadius: '10px', color: '#9a3412' }}><Percent size={24} /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#9a3412', fontWeight: '500' }}>Precio Medio</p>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '700' }}>{data.totales.precio_medio_kwh} <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>€/kWh</span></h3>
                </div>
              </div>

            </div>

            {/* Contenedor del Gráfico */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', fontWeight: '700', color: '#374151' }}>Análisis Comparativo por Tramos Horarios</h2>
              
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepararDatosGrafico()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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

          </section>
        )}
      </main>
    </div>
  );
}

export default App;
