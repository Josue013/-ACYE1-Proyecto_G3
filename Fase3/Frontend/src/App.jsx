//import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './App.css';
import { TiempoReal } from './TReal';
import { TiempoRango } from './TiempoRango';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { generateCSV } from './Services/APIs/Api';
import { Analisis } from './Analisis';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const handleGenerateCSV = async () => {
  try {
    await generateCSV();
    alert('CSV generado y descargado con éxito');
  } catch (error) {
    alert('Error al generar el CSV' + error);
  }
}

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-button">Tiempo Real</Link>
        <Link to="/TiempoRango" className="navbar-button">Rango de Tiempo</Link>
        <button className="navbar-button" onClick={handleGenerateCSV}>Generar CSV</button>
        <Link to="/Analisis" className="navbar-button">Análisis</Link>
      </nav>
      <Routes>
        <Route path="/" element={<TiempoReal />} />
        <Route path="/TiempoRango" element={<TiempoRango />} />
        <Route path="/Analisis" element={<Analisis/>} />
      </Routes>
    </Router>
  )
}

export default App;
