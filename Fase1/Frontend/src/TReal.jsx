import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './App.css';
import Service from './Services/Service';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export function TiempoReal() {
    const [data, setData] = useState({
        temperature: [],
        humidityRelative: [],
        humidityAbsolute: [],
        windSpeed: 0,
        barometricPressure: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await Service.getData();
                const latestData = result[result.length - 1];
                setData({
                    temperature: [...data.temperature, latestData.temperature].slice(-10),
                    humidityRelative: [...data.humidityRelative, latestData.humidityRelative].slice(-10),
                    humidityAbsolute: [...data.humidityAbsolute, latestData.humidityAbsolute].slice(-10),
                    windSpeed: latestData.windSpeed,
                    barometricPressure: latestData.barometricPressure,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, [data]);

    const doughnutChartOptions = {
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

    return (
        <>
            <div className='title'>
                <h1>Gráficas en Tiempo Real</h1>
            </div>
            <div className="graficas">
                <div className="grafica">
                    <h2>Temperatura Ambiente °C</h2>
                    <Line data={{
                        labels: data.temperature.map((_, index) => index),
                        datasets: [{
                            label: 'Temperatura °C',
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
                            label: 'Humedad Relativa %',
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
                            label: 'Humedad Absoluta kg/m³',
                            data: data.humidityAbsolute,
                            borderColor: 'rgba(255, 159, 64, 1)',
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        }]
                    }} options={lineChartOptions} />
                </div>

                <div className="grafica">
                    <h2>Velocidad del Viento m/s</h2>
                    <Doughnut data={{
                        labels: ['Velocidad del Viento'],
                        datasets: [{
                            label: 'Velocidad del Viento m/s',
                            data: [data.windSpeed, 10 - data.windSpeed],
                            backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                            borderWidth: 1,
                        }]
                    }} options={doughnutChartOptions} />
                </div>

                <div className="grafica">
                    <h2>Presión Barométrica Pa</h2>
                    <Doughnut data={{
                        labels: ['Presión Barométrica'],
                        datasets: [{
                            label: 'Presión Barométrica Pa',
                            data: [data.barometricPressure, 1000 - data.barometricPressure],
                            backgroundColor: ['rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                            borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                            borderWidth: 1,
                        }]
                    }} options={doughnutChartOptions} />
                </div>
            </div>
        </>
    );
}