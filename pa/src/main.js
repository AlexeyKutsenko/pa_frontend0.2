import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import Vue from 'vue'
import VueRouter from "vue-router";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from "./router/router";
import Axios from "axios";
import store from './store';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token');
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Token ' + token
}


Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router: router,
    store,
    render: h => h(App)
}).$mount('#app');
