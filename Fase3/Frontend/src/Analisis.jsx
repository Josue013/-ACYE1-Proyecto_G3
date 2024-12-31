import React from 'react';
import './Analisis.css'; // Asegúrate de que el archivo de estilos esté enlazado correctamente.

export function Analisis() {
  return (
    <>
      <div className="title">
        <h1>Pagina estadística</h1>
      </div>

      <div className="content">
        <div className="file-input-group">
          <label className="upload-button-csv">
            Archivo CSV
            <input className="file-input-hidden" type="file" accept=".csv" />
          </label>
          <label className="upload-button-txt">
            Archivo TXT
            <input className="file-input-hidden" type="file" accept=".txt" />
          </label>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Cálculo</th>
              <th>Python</th>
              <th>Assembler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Promedio</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Moda</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Valor mínimo</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
              <td>Valor máximo</td>
              <td></td>
              <td></td>
            </tr>   
            <tr>
              <td>Rango de temperatura interna</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
              <td>Rango de temperatura externa</td>
                <td></td>
                <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
