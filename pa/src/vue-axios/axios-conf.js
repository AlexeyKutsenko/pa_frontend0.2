import axios from 'axios/index'

export const BASE = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});