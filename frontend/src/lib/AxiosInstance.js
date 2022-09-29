import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/api';
const instance = axios.create({});

export default instance;
