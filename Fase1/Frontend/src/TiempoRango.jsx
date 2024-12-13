import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getDataRange } from './Services/APIs/Api';
import './TiempoRango.css';

export function TiempoRango() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dataRange, setDataRange] = useState({
        timestamps: [],
        temperature: [],
        humidityRelative: [],
        humidityAbsolute: [],
        windSpeed: [],
        barometricPressure: []
    });
    const [error, setError] = useState('');

    const handleFindData = async () => {
        // Reset previous state
        setError('');
        setDataRange({
            timestamps: [],
            temperature: [],
            humidityRelative: [],
            humidityAbsolute: [],
            windSpeed: [],
            barometricPressure: []
        });

        // Validate date inputs
        if (!startDate || !endDate) {
            setError('Por favor seleccione fechas de inicio y fin');
            return;
        }

        try {
            const data = await getDataRange(startDate, endDate);
            // Process data for each metric
            const processedData = {
                timestamps: data.map(item => new Date(item.timestamp).toLocaleString()),
                temperature: data.map(item => item.temperature),
                humidityRelative: data.map(item => item.humidityRelative),
                humidityAbsolute: data.map(item => item.humidityAbsolute),
                windSpeed: data.map(item => item.windSpeed),
                barometricPressure: data.map(item => item.barometricPressure)
            };

            setDataRange(processedData);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener datos');
        }
    };

    const chartOptions = {
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

    const createChartData = (label, data, timestamps) => ({
        labels: timestamps,
        datasets: [{
            label: label,
            data: data.length > 0 ? data : [0],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
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
                        <h3>Temperatura</h3>
                        <Line 
                            data={createChartData('Temperatura', dataRange.temperature, dataRange.timestamps)} 
                            options={chartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Humedad Relativa</h3>
                        <Line 
                            data={createChartData('Humedad Relativa', dataRange.humidityRelative, dataRange.timestamps)} 
                            options={chartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Humedad Absoluta</h3>
                        <Line 
                            data={createChartData('Humedad Absoluta', dataRange.humidityAbsolute, dataRange.timestamps)} 
                            options={chartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Velocidad del Viento</h3>
                        <Line 
                            data={createChartData('Velocidad del Viento', dataRange.windSpeed, dataRange.timestamps)} 
                            options={chartOptions} 
                        />
                    </div>
                    <div className="chart">
                        <h3>Presión Barométrica</h3>
                        <Line 
                            data={createChartData('Presión Barométrica', dataRange.barometricPressure, dataRange.timestamps)} 
                            options={chartOptions} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
