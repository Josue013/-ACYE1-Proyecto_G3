import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './App.css';
import Service from './Services/Service';
import gotaAgua from '../src/assets/gota-de-agua.png';
import gotaAguaNegra from '../src/assets/gota-de-agua-negra.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export function TiempoReal() {
    const [data, setData] = useState({
        indoorTemperature: [],
        outdoorTemperature: [],
        humidity: [],
        waterTankLevel: [],
    });

    const [initialLoad, setInitialLoad] = useState(true);
    const [alertsReady, setAlertsReady] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await Service.getData();
                const latestData = result[result.length - 1];
                setData(prevData => ({
                    ...prevData,
                    indoorTemperature: [...prevData.indoorTemperature, latestData.indoorTemperature].slice(-10),
                    outdoorTemperature: [...prevData.outdoorTemperature, latestData.outdoorTemperature].slice(-10),
                    humidity: [...prevData.humidity, latestData.humidity].slice(-10),
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchLevelData = async () => {
            try {
                const result = await Service.getLevelData();
                const latestData = result[result.length - 1];
                setData(prevData => ({
                    ...prevData,
                    waterTankLevel: [...prevData.waterTankLevel, latestData.waterTankLevel].slice(-10),
                }));
                setInitialLoad(false);
                setAlertsReady(true); // Indicar que las alertas están listas para mostrarse
            } catch (error) {
                console.error('Error fetching level data:', error);
            }
        };

        fetchData();
        fetchLevelData();
        const interval = setInterval(() => {
            fetchData();
            fetchLevelData();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Determinar la imagen a mostrar según el valor de humedad
    const humedadActual = data.humidity.length > 0 ? data.humidity[data.humidity.length - 1] : 0;
    const imagenHumedad = humedadActual === 1 ? gotaAgua : gotaAguaNegra;
    const textoHumedad = humedadActual === 1 ? "Hay humedad :)" : "No hay humedad :(";

    let delayed;

    const doughnutChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Nivel del tanque de agua (%)',
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
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                }
                return delay;
            },
        },
    };

    // Alertas 
    useEffect(() => {
        if (alertsReady && !initialLoad) {
            if (humedadActual === 1) {
                setTimeout(() => {
                    alert("La tierra está húmeda. Sugerencia: cortar el flujo de agua.");
                }, 500); 
            }
        }
    }, [humedadActual, initialLoad, alertsReady]);

    useEffect(() => {
        if (alertsReady && !initialLoad) {
            const temperaturaInterna = data.indoorTemperature.length > 0 ? data.indoorTemperature[data.indoorTemperature.length - 1] : 0;
            if (temperaturaInterna > 25 && temperaturaInterna < 35) {
                setTimeout(() => {
                    alert("La temperatura interna ha subido más allá de la temperatura ideal (25°C). Temperatura actual: "+ temperaturaInterna);
                }, 500); 
            }
        }
    }, [data.indoorTemperature, initialLoad, alertsReady]);

    useEffect(() => {
        if (alertsReady && !initialLoad) {
            const nivelTanque = data.waterTankLevel.length > 0 ? data.waterTankLevel[data.waterTankLevel.length - 1] : 100;
            if (nivelTanque < 30) {
                setTimeout(() => {
                    alert("El tanque tiene menos del 30%. Se debe llenar el tanque de nuevo Nivel del tanque: "+nivelTanque);
                }, 500); 
            }
        }
    }, [data.waterTankLevel, initialLoad, alertsReady]);

    useEffect( () => {
        if (alertsReady && !initialLoad) {
            const temperaturaInterna = data.indoorTemperature.length > 0 ? data.indoorTemperature[data.indoorTemperature.length - 1] : 0;
            if (temperaturaInterna > 35) {
                setTimeout(() => {
                    alert("La temperatura ha excedido los 35 grados, el aire acondicionado se ha activado para mantener la temperatura ideal. Temperatura actual: "+temperaturaInterna);
                }, 500); 
            }
        }
    }, [data.indoorTemperature, initialLoad, alertsReady]);

    return (
        <>
            <div className='title'>
                <h1>Gráficas en Tiempo Real</h1>
            </div>
            <div className="graficas">
                <div className="grafica">
                    <Line data={{
                        labels: data.indoorTemperature.map((_, index) => index),
                        datasets: [{
                            label: 'Temperatura Interna °C',
                            data: data.indoorTemperature,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            pointStyle: 'circle',
                            pointRadius: 4,
                        }]
                    }} options={lineChartOptions} />
                </div>

                <div className="grafica">
                    <Line data={{
                        labels: data.outdoorTemperature.map((_, index) => index),
                        datasets: [{
                            label: 'Temperatura Externa °C',
                            data: data.outdoorTemperature,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            pointStyle: 'circle',
                            pointRadius: 4,
                        }]
                    }} options={lineChartOptions} />
                </div>

                <div className="grafica">
                    <img className='gota' src={imagenHumedad} alt="Estado de Humedad" />
                    <p className='TextHumedad'>{textoHumedad}</p>
                </div>

                <div className="grafica doughnut-container">
                    <Doughnut data={{
                        labels: ['Nivel de Agua', 'Espacio Vacío'],
                        datasets: [{
                            label: 'Nivel del tanque de agua',
                            data: initialLoad ? [0, 100] : [data.waterTankLevel[data.waterTankLevel.length - 1], 100 - data.waterTankLevel[data.waterTankLevel.length - 1]],
                            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(200, 200, 200, 0.2)'],
                            borderColor: ['rgba(255, 159, 64, 1)', 'rgba(200, 200, 200, 1)'],
                            borderWidth: 1,
                        }],
                    }} options={doughnutChartOptions} />
                </div>
            </div>
        </>
    );
}