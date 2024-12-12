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