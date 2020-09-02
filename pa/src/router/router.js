import VueRouter from "vue-router";
import IndicesList from "../components/IndicesList"
import IndexView from "../components/IndexView"
import GoalsList from "../components/GoalsList";
import GoalView from "../components/GoalView";
import HomePage from "../components/HomePage";
import Login from "../components/Login";
import Registration from "../components/Registration";
import PortfoliosList from "../components/PortfoliosList";
import PortfolioView from "../components/PortfolioView";

const router = new VueRouter({
    mode: "history",
    routes: [
        {path: "/", name: "home", component: HomePage,},
        {path: "/login", name: 'login', component: Login, meta: {guest: true}},
        {path: "/registration", name: "registration", component: Registration, meta: {guest: true}},
        {path: "/indices", component: IndicesList, meta: {requiresAuth: true}},
        {path: "/indices/:id", component: IndexView, meta: {requiresAuth: true}},
        {path: "/goals", component: GoalsList, meta: {requiresAuth: true}},
        {path: "/goals/:id", component: GoalView, meta: {requiresAuth: true}},
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
