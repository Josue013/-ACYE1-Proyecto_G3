import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function TiempoRango() {
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

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
                display: true,
                
            },
            },
    };

    return(
        <>
            <div className='title'>
                <h1>Graficas a lo largo del tiempo</h1>
            </div>
            
            <div className="graficas">
                <div className="grafica">
                <h2>Temperatura Ambiente °C</h2>
                <Line data={{
                    labels: data.temperature.map((_, index) => index),
                    datasets: [{
                    label: 'Temperatura °C VS Tiempo',
                    data: data.temperature,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    }]
                }} options={lineChartOptions} />
                </div>

                <div className="grafica">
                <h2>Humedad Relativa %</h2>
                <Line data={{
                    labels: data.humidityRelative.map((_, index) => index),
                    datasets: [{
                    label: 'Humedad Relativa % VS Tiempo',
                    data: data.humidityRelative,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    }]
                }} options={lineChartOptions} />
                </div>

                <div className="grafica">
                <h2>Humedad Absoluta kg/m³</h2>
                <Line data={{
                    labels: data.humidityAbsolute.map((_, index) => index),
                    datasets: [{
                    label: 'Humedad Absoluta kg/m³ VS Tiempo',
                    data: data.humidityAbsolute,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    }]
                }} options={lineChartOptions} />
                </div>

                <div className="grafica">
                <h2>Velocidad del Viento m/s</h2>
                <Line data={{
                    labels: data.windSpeedInTime.map((_, index) => index),
                    datasets: [{
                    label: 'Velocidad del Viento m/s VS Tiempo',
                    data: data.windSpeedInTime,
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    }]
                }} options={lineChartOptions} />
                </div>

                <div className="grafica">
                <h2>Velocidad del Viento m/s</h2>
                <Line data={{
                    labels: data.barometricPressureInTime.map((_, index) => index),
                    datasets: [{
                    label: 'Presión Barométrica Pa VS Tiempo',
                    data: data.barometricPressureInTime,
                    borderColor: 'rgba(255, 206, 86, 0.5)',
                    backgroundColor: 'rgba(255, 206, 86, 1)',
                    }]
                }} options={lineChartOptions} />
                </div>
            </div>
    </>
    )

}