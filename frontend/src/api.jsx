
import axios from 'axios';

const api = axios.create({
    baseURL: `http://localhost:4001/todo`
});

export const googleAuth = (code) => api.post('/google', { code });
