import axios from 'axios/index'

export const BASE = axios.create({
    baseURL: process.env.API_URL
});