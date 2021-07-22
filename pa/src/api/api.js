import store from "../store";
import axios from "axios/index";

function getAuthHeaders() {
    if (store.state.token) {
        return {'Authorization': 'Token ' + store.state.token}
    } else {
        return {}
    }
}

export function getBaseApi() {
    let headers = getAuthHeaders()
    return axios.create({
        baseURL: process.env.VUE_APP_BASE_API_URL,
        headers: headers
    })
}

export function getUserApi() {
    let headers = getAuthHeaders()
    return axios.create({
        baseURL: process.env.VUE_APP_USERS_API_URL,
        headers: headers
    })
}

export function getFinApi() {
    let headers = getAuthHeaders()
    return axios.create({
        baseURL: process.env.VUE_APP_FIN_API_URL,
        headers: headers
    })
}
