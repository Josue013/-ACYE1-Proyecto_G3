import React, { useState } from 'react';
import axios from 'axios';
import './Analisis.css';

export function Analisis() {
  const [stats, setStats] = useState(null);
  const [txtStats, setTxtStats] = useState({}); 
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStats(response.data);
      setError(null);
    } catch (error) {
      setError('Error al analizar el archivo CSV');
      setStats(null);
    }
  };

  const handleTxtFileUpload = async (event, endpoint) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://localhost:5000/api/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTxtStats(prevState => ({ ...prevState, [endpoint]: response.data }));
      setError(null);
    } catch (error) {
      setError(`Error al analizar el archivo ${endpoint}`);
      setTxtStats(prevState => ({ ...prevState, [endpoint]: null }));
    }
  };

  const renderTable = (title, dataKey, singleRow = false) => (
    <table className="data-table">
      <thead>
        <tr>
          <th>{title}</th>
          <th>Python</th>
          <th>Assembler</th>
        </tr>
      </thead>
      <tbody>
        {(singleRow ? ['diferencia_minimas', 'diferencia_maximas'] : ['temp_externa', 'temp_interna', 'humedad', 'nivel_agua']).map((rowKey) => (
          <tr key={rowKey}>
            <td>{rowKey.replace(/_/g, ' ')}</td>
            <td>{stats?.[dataKey]?.[rowKey]?.toFixed(2) || ''}</td>
            <td>{txtStats?.[dataKey]?.[rowKey]?.toFixed(2) || ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="title">
        <h1>Pagina estadística</h1>
      </div>

      <div className="content">
        <div className="file-input-group">
          <label className="upload-button-csv">
            Archivo CSV
            <input className="file-input-hidden" type="file" accept=".csv" onChange={handleFileUpload} />
          </label>
          <label className="upload-button-txt">
            Promedios (average.txt)
            <input className="file-input-hidden" type="file" accept=".txt" onChange={(e) => handleTxtFileUpload(e, 'analyze-average')} />
          </label>
          <label className="upload-button-txt">
            Moda (moda.txt)
            <input className="file-input-hidden" type="file" accept=".txt" onChange={(e) => handleTxtFileUpload(e, 'analyze-moda')} />
          </label>
          <label className="upload-button-txt">
            Temperatura Máxima (tmax.txt)
            <input className="file-input-hidden" type="file" accept=".txt" onChange={(e) => handleTxtFileUpload(e, 'analyze-tmax')} />
          </label>
          <label className="upload-button-txt">
            Temperatura Mínima (tmin.txt)
            <input className="file-input-hidden" type="file" accept=".txt" onChange={(e) => handleTxtFileUpload(e, 'analyze-tmin')} />
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        {stats || Object.keys(txtStats).length > 0 ? (
          <div>
            {renderTable('Promedio', 'promedios')}
            {renderTable('Moda', 'modas')}
            {renderTable('Rango de Temperatura', 'rangos', true)}
            {renderTable('Valor Máximo', 'maximos')}
            {renderTable('Valor Mínimo', 'minimos')}
          </div>
        ) : (
          <p>No se han cargado datos</p>
        )}
      </div>
    </>
  );
}