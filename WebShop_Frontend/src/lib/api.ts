import axios from 'axios';

// Vanlig instans – alla interceptors kopplas hit
export const api = axios.create({ baseURL: '/' });

// Ren instans utan interceptors – används ENBART för token refresh
export const refreshApi = axios.create({ baseURL: '/' });
