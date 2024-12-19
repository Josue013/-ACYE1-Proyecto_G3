import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getDataRangeSensor, getDataRangeLevel } from './Services/APIs/Api';
import './TiempoRango.css';

export function TiempoRango() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dataRange, setDataRange] = useState({
        timestamps: [],
        indoorTemperature: [],
        outdoorTemperature: [],
        humidity: [],
        waterTankLevel: [],
        bombActivation: [],
        airActivation: []
    });
    const [error, setError] = useState('');

    const handleFindData = async () => {
        setError('');
        setDataRange({
            timestamps: [],
            indoorTemperature: [],
            outdoorTemperature: [],
            humidity: [],
            waterTankLevel: [],
            bombActivation: [],
            airActivation: []
        });

        if (!startDate || !endDate) {
            setError('Por favor seleccione fechas de inicio y fin');
            return;
        }

        try {
            // Obtener datos de sensores y nivel de tanque de agua
            const sensorData = await getDataRangeSensor(startDate, endDate);
            const levelData = await getDataRangeLevel(startDate, endDate);

            // Procesar datos para gráficas
            const processedSensorData = {
                timestamps: sensorData.map(item => new Date(item.timestamp).toLocaleString()),
                indoorTemperature: sensorData.map(item => item.indoorTemperature),
                outdoorTemperature: sensorData.map(item => item.outdoorTemperature),
                humidity: sensorData.map(item => item.humidity),
                bombActivation: sensorData.map(item => item.bombActivation),
                airActivation: sensorData.map(item => item.airActivation),
                waterTankLevel: levelData.map(item => item.waterTankLevel)
            };

            setDataRange(processedSensorData);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener datos');
        }
    };

    const baseChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Opciones específicas para gráficas digitales (humedad, bomba, aire)
    const digitalChartOptions = {
        ...baseChartOptions,
        scales: {
            y: {
                beginAtZero: true,
                max: 1.2,
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        if (value === 0) return '0';
                        if (value === 1) return '1';
                        return '';
                    }
                }
            }
        }
    };

    const createChartData = (label, data, timestamps, color = 'rgb(75, 192, 192)', isDigital = false) => ({
        labels: timestamps,
        datasets: [{
            label: label,
            data: data.length > 0 ? data : [0],
            borderColor: color,
            backgroundColor: color.replace(')', ', 0.2)'),
            tension: isDigital ? 0 : 0.1,
            pointStyle: isDigital ? 'rect' : 'circle',
            pointRadius: isDigital ? 2 : 4,
            stepped: isDigital ? 'before' : false,
            borderWidth: isDigital ? 2 : 1,
            segment: {
                borderColor: ctx => isDigital ? color : undefined
            }
        }]
    });

    return (
        <>
            <div className='title'>
                <h1>Gráficas Históricas</h1>
            </div>
            <div className="tiempo-rango-container">
                <div className="time-range-div">
                    <div className="time-date">
                        <label>Fecha Inicial:</label>
                        <input 
                            type="datetime-local" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="time-date">
                        <label>Fecha Final:</label>
                        <input 
                            type="datetime-local" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="time-find">
                        <button onClick={handleFindData}>Buscar Datos</button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="charts-container">
                    <div className="chart">
                        <h3>Temperatura Interna</h3>
                        <Line 
                            data={createChartData('Temperatura Interna °C', dataRange.indoorTemperature, dataRange.timestamps, 'rgb(75, 192, 192)')} 
                            options={baseChartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Temperatura Externa</h3>
                        <Line 
                            data={createChartData('Temperatura Externa °C', dataRange.outdoorTemperature, dataRange.timestamps, 'rgb(153, 102, 255)')} 
                            options={baseChartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Estado de Humedad</h3>
                        <Line 
                            data={createChartData('Estado de Humedad', dataRange.humidity, dataRange.timestamps, 'rgb(255, 99, 132)', true)} 
                            options={digitalChartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Activación de la Bomba de Agua</h3>
                        <Line 
                            data={createChartData('Estado de la Bomba', dataRange.bombActivation, dataRange.timestamps, 'rgb(54, 162, 235)', true)} 
                            options={digitalChartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Activación del Aire Acondicionado</h3>
                        <Line 
                            data={createChartData('Estado del Aire', dataRange.airActivation, dataRange.timestamps, 'rgb(75, 192, 192)', true)} 
                            options={digitalChartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Nivel del Tanque de Agua</h3>
                        <Line 
                            data={createChartData('Nivel del Tanque %', dataRange.waterTankLevel, dataRange.timestamps, 'rgb(255, 159, 64)')} 
                            options={baseChartOptions} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
}