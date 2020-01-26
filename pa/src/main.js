import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import Vue from 'vue'
import VueRouter from "vue-router";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import index from "./router";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
    router: index,
    render: h => h(App),
}).$mount('#app');
