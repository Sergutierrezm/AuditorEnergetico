import React, { useState } from 'react';
import { Zap, Upload, FileText, RefreshCw } from 'lucide-react';
import ErrorAlert from './components/ErrorAlert';
import KpiCards from './components/KpiCards';
import MainChart from './components/MainChart';

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

      const result = await response.json();

      if (!response.ok) {
        // Capturamos el mensaje exacto detail que manda nuestro HTTPException de FastAPI
        throw new Error(result.detail || 'Error al procesar el archivo.');
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

        {/* Componente de Errores */}
        <ErrorAlert message={error} />

        {/* DASHBOARD DE RESULTADOS (Componentes Modulares) */}
        {data && (
          <section style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <KpiCards totales={data.totales} />
            <MainChart 
              consumo={data.distribucion_consumo_kwh} 
              gasto={data.distribucion_gasto_euros} 
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
