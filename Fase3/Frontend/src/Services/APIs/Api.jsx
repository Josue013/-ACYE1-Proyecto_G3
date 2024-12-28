import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getData = async () => {
    try {
        const response = await api.get('/api/data');
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
    }
};

export const getLevelData = async () => {
    try {
        const response = await api.get('/api/level-data');
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos de nivel:', error);
        throw error;
    }
};

export const getDataRangeSensor = async (startDate, endDate) => {
    try {
        const response = await api.post('/api/data-range-sensor', {
            start_date: startDate,
            end_date: endDate
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener rango de datos de sensores:', error);
        throw error;
    }
};

export const getDataRangeBomb = async (startDate, endDate) => {
    try {
        const response = await api.post('/api/data-range-bomb', {
            start_date: startDate,
            end_date: endDate
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener rango de datos de bomba:', error);
        throw error;
    }
};

export const getDataRangeLevel = async (startDate, endDate) => {
    try {
        const response = await api.post('/api/data-range-level', {
            start_date: startDate,
            end_date: endDate
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener rango de datos de nivel:', error);
        throw error;
    }
};

export const generateCSV = async () => {
    try {
        const response = await api.get('/api/generate-csv');
        return response.data;
    } catch (error) {
        console.error('Error generating CSV:', error);
        throw error;
    }
};