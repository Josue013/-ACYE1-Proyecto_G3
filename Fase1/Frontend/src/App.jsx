import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useState, useEffect } from 'react';
//import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './App.css';
import { TiempoReal } from './TReal';
import { TiempoRango } from './TiempoRango';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);


function App() {
  const [data, setData] = useState({
    temperature: [],
    humidityRelative: [],
    humidityAbsolute: [],
    windSpeedInTime: [],
    barometricPressureInTime: [],
    windSpeed: 0,
    barometricPressure: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulación de datos en tiempo real
      setData({
        temperature: [...data.temperature, Math.random() * 30],
        humidityRelative: [...data.humidityRelative, Math.random() * 100],
        humidityAbsolute: [...data.humidityAbsolute, Math.random() * 30],
        windSpeedInTime: [...data.windSpeedInTime, Math.random() * 10],
        barometricPressureInTime: [...data.barometricPressureInTime, Math.random() * 1000],
        windSpeed: Math.random() * 10,
        barometricPressure: Math.random() * 1000,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  // const lineChartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
        
  //     },
  //   },
  // };

  // const doughnutChartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
        
  //     },
  //   },
  // };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-button">Tiempo Real</Link>
        <Link to="/TiempoRango" className="navbar-button">Rango de Tiempo</Link>
      </nav>
      <Routes>
        <Route path="/" element={<TiempoReal />} />
        <Route path="/TiempoRango" element={<TiempoRango />} />
      </Routes>
    </Router>
  )
}
export default App
