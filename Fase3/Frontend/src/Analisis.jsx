import React, { useState } from 'react';
import axios from 'axios';
import './Analisis.css'; // Asegúrate de que el archivo de estilos esté enlazado correctamente.

export function Analisis() {
  const [stats, setStats] = useState(null);
  const [txtStats, setTxtStats] = useState(null);
  const [error, setError] = useState(null);

  // Funcion que se encarga de subir un archivo CSV para analizarlo
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

  // Funcion que se encarga de subir un archivo TXT para analizarlo
  const handleTxtFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-txt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTxtStats(response.data);
      setError(null);
    } catch (error) {
      setError('Error al analizar el archivo TXT');
      setTxtStats(null);
    }
  };

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
            Archivo TXT
            <input className="file-input-hidden" type="file" accept=".txt" onChange={handleTxtFileUpload} />
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <table className="data-table">
          <thead>
            <tr>
              <th>Cálculo</th>
              <th>Python</th>
              <th>Assembler</th>
            </tr>
          </thead>
          <tbody>
            {stats || txtStats ? (
              <>
                <tr>
                  <td>Promedio</td>
                  <td>{stats ? stats.promedios.temp_externa.toFixed(2) : ''}</td>
                  <td>{txtStats ? txtStats.promedio.toFixed(2) : ''}</td>
                </tr>
                <tr>
                  <td>Moda</td>
                  <td>{stats ? stats.modas.temp_externa : ''}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Valor mínimo</td>
                  <td>{stats ? stats.min_max.temp_externa[0] : ''}</td>
                  <td>{txtStats ? txtStats.valorminimo : ''}</td>
                </tr>
                <tr>
                  <td>Valor máximo</td>
                  <td>{stats ? stats.min_max.temp_externa[1] : ''}</td>
                  <td>{txtStats ? txtStats.valormaximo : ''}</td>
                </tr>
                <tr>
                  <td>Rango de temperatura interna</td>
                  <td>{stats ? stats.rangos.diferencia_minimas : ''}</td>
                  <td>{txtStats ? txtStats.rangotempinterna : ''}</td>
                </tr>
                <tr>
                  <td>Rango de temperatura externa</td>
                  <td>{stats ? stats.rangos.diferencia_maximas : ''}</td>
                  <td>{txtStats ? txtStats.rangotempexterna : ''}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="3">No se han cargado datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}