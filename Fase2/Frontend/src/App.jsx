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
