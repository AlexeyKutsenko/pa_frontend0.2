import VueRouter from "vue-router";
import IndicesList from "../components/Index/IndicesList"
import IndexView from "../components/Index/IndexView"
import HomePage from "../components/HomePage";
import Login from "../components/Auth/Login";
import Registration from "../components/Auth/Registration";
import PortfoliosList from "../components/Portfolio/PortfoliosList";
import PortfolioView from "../components/Portfolio/PortfolioView";

const router = new VueRouter({
    mode: "history",
    routes: [
        {path: "/", name: "home", component: HomePage,},
        {path: "/login", name: 'login', component: Login, meta: {guest: true}},
        {path: "/registration", name: "registration", component: Registration, meta: {guest: true}},
        {path: "/indices", component: IndicesList, meta: {requiresAuth: true}},
        {path: "/indices/:id", component: IndexView, meta: {requiresAuth: true}},
        {path: "/portfolios", component: PortfoliosList, meta: {requiresAuth: true}},
        {path: "/portfolios/:id", component: PortfolioView, meta: {requiresAuth: true}}
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('token') == null) {
            next({
                path: '/login',
                params: {nextUrl: to.fullPath}
            })
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.getItem('token') == null) {
            next()
        } else {
            next({name: 'home'})
        }
    } else {
        next()
    }
})

export default router;
