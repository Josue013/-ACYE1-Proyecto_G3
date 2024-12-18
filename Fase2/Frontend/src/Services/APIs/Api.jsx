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
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getLevelData = async () => {
    try {
        const response = await api.get('/api/level-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching level data:', error);
        throw error;
    }
};

export const getDataRange = async (startDate, endDate) => {
    try {
        const response = await api.post('/api/data-range', {
            start_date: startDate,
            end_date: endDate
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data range:', error);
        throw error;
    }
};