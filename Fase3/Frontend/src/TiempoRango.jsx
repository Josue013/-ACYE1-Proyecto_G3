import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getDataRangeSensor, getDataRangeLevel, getDataRangeBomb } from './Services/APIs/Api';
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
    const [error, setError] = useState({
        sensor: '',
        level: '',
        bomb: ''
    });

    const handleFindData = async () => {
        // Reiniciar estados
        setError({
            sensor: '',
            level: '',
            bomb: ''
        });
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
            setError({
                sensor: 'Por favor seleccione fechas de inicio y fin',
                level: 'Por favor seleccione fechas de inicio y fin',
                bomb: 'Por favor seleccione fechas de inicio y fin'
            });
            return;
        }

        try {
            // Obtener datos de cada fuente independientemente
            const [sensorResponse, levelResponse, bombResponse] = await Promise.allSettled([
                getDataRangeSensor(startDate, endDate),
                getDataRangeLevel(startDate, endDate),
                getDataRangeBomb(startDate, endDate)
            ]);

            let newDataRange = {
                timestamps: [],
                indoorTemperature: [],
                outdoorTemperature: [],
                humidity: [],
                waterTankLevel: [],
                bombActivation: [],
                airActivation: []
            };

            let newError = {
                sensor: '',
                level: '',
                bomb: ''
            };

            // Procesar datos de sensores
            if (sensorResponse.status === 'fulfilled' && Array.isArray(sensorResponse.value)) {
                const sensorData = sensorResponse.value;
                newDataRange = {
                    ...newDataRange,
                    timestamps: sensorData.map(item => new Date(item.timestamp).toLocaleString()),
                    indoorTemperature: sensorData.map(item => item.indoorTemperature),
                    outdoorTemperature: sensorData.map(item => item.outdoorTemperature),
                    humidity: sensorData.map(item => item.humidity),
                    airActivation: sensorData.map(item => item.airActivation),
                };
            } else {
                newError.sensor = 'No hay datos de sensores para este rango de fechas';
            }

            // Procesar datos de nivel
            if (levelResponse.status === 'fulfilled' && Array.isArray(levelResponse.value)) {
                const levelData = levelResponse.value;
                newDataRange.waterTankLevel = levelData.map(item => item.waterTankLevel);
                if (!newDataRange.timestamps.length) {
                    newDataRange.timestamps = levelData.map(item => new Date(item.timestamp).toLocaleString());
                }
            } else {
                newError.level = 'No hay datos sobre el nivel del tanque para este rango de fechas.';
            }

            // Procesar datos de bomba
            if (bombResponse.status === 'fulfilled' && Array.isArray(bombResponse.value)) {
                const bombData = bombResponse.value;
                newDataRange.bombActivation = bombData.map(item => item.bombActivation);
                if (!newDataRange.timestamps.length) {
                    newDataRange.timestamps = bombData.map(item => new Date(item.timestamp).toLocaleString());
                }
            } else {
                newError.bomb = 'No hay datos de bomba para este rango de fechas';
            }

            setDataRange(newDataRange);
            setError(newError);

        } catch (err) {
            setError({
                sensor: 'Error al obtener datos de sensores',
                level: 'Error al obtener datos de nivel',
                bomb: 'Error al obtener datos de bomba'
            });
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

    // Opciones específicas para la gráfica de humedad
    const humidityChartOptions = {
        ...baseChartOptions,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Humedad (%)'
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

    const renderChart = (title, data, options, color, isDigital = false) => {
        if (data.length === 0) {
            return (
                <div className="chart">
                    <h3>{title}</h3>
                    <div className="no-data-message">No hay datos disponibles para este período</div>
                </div>
            );
        }

        return (
            <div className="chart">
                <h3>{title}</h3>
                <Line 
                    data={createChartData(title, data, dataRange.timestamps, color, isDigital)} 
                    options={options} 
                />
            </div>
        );
    };

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

                {(error.sensor || error.level || error.bomb) && (
                    <div className="error-messages">
                        {error.sensor && <div className="error-message">{error.sensor}</div>}
                        {error.level && <div className="error-message">{error.level}</div>}
                        {error.bomb && <div className="error-message">{error.bomb}</div>}
                    </div>
                )}

                <div className="charts-container">
                    {renderChart('Temperatura Interna °C', dataRange.indoorTemperature, baseChartOptions, 'rgb(75, 192, 192)')}
                    {renderChart('Temperatura Externa °C', dataRange.outdoorTemperature, baseChartOptions, 'rgb(153, 102, 255)')}
                    {renderChart('Humedad %', dataRange.humidity, humidityChartOptions, 'rgb(255, 99, 132)')}
                    {renderChart('Estado de la Bomba', dataRange.bombActivation, digitalChartOptions, 'rgb(54, 162, 235)', true)}
                    {renderChart('Estado del Aire', dataRange.airActivation, digitalChartOptions, 'rgb(75, 192, 192)', true)}
                    {renderChart('Nivel del Tanque %', dataRange.waterTankLevel, baseChartOptions, 'rgb(255, 159, 64)')}
                </div>
            </div>
        </>
    );
}