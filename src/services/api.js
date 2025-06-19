import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/orders';

export const syncOrders = (channel) => axios.post(`${BASE_URL}/sync/${channel}`);
export const getOrders = (params = {}) => axios.get(BASE_URL, { params });
export const retryOrder = (orderId) => axios.put(`${BASE_URL}/retry/${orderId}`);
export const getStats = () => axios.get(`${BASE_URL}/stats`);
