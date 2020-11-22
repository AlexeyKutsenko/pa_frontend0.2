import axios from 'axios/index'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function save_auth_info(username, token, commit) {

    localStorage.setItem('username', username)
    localStorage.setItem('token', token)
    Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Token ' + token

    commit('auth_success', {username, token})
}

const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('token') || '',
        username: localStorage.getItem('username') || '',
    },
    mutations: {
        auth_success(state, {username, token}) {
            state.username = username;
            state.token = token
        },
        logout(state) {
            state.username = '';
            state.token = ''
        },
    },
    actions: {
        login({commit, getters}, user_info) {
            return new Promise((resolve, reject) => {
                getters.users_api.post('/login/', {
                    'username': user_info.username,
                    'password': user_info.password
                })
                    .then(response => {
                        save_auth_info(user_info.username, response.data['key'], commit);
                        resolve(response)
                    })
                    .catch(err => {
                        localStorage.removeItem('token')
                        reject(err)
                    })
            })
        },
        registration({commit, getters}, user_info) {
            return new Promise((resolve, reject) => {
                getters.users_api.post('/registration/', {
                    'username': user_info.username,
                    'email': user_info.email,
                    'password1': user_info.password,
                    'password2': user_info.repeatPassword,
                })
                    .then(response => {
                        save_auth_info(user_info.username, response.data['key'], commit);
                        resolve(response)
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        localStorage.removeItem('username');
                        localStorage.removeItem('token');
                        reject(err)
                    })
            })
        },
        logout({commit}) {
            return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
                commit('logout')
                localStorage.removeItem('token')
                localStorage.removeItem('username')
                delete Vue.prototype.$http.defaults.headers.common['Authorization']
                resolve()
            })
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        token: state => {
            return state.token
        },
        username: state => {
            return state.username
        },
        users_api: state => {
            let headers = {}
            if (state.token) {
                headers = {'Authorization': 'Token ' + state.token}
            }
            return axios.create({
                baseURL: process.env.VUE_APP_USERS_API_URL,
                headers: headers
            })
        },
        finApi: state => {
            return axios.create({
                baseURL: process.env.VUE_APP_FIN_API_URL,
                headers: {
                    'Authorization': 'Token ' + state.token
                }
            })
        }
    }
})

export default store;
