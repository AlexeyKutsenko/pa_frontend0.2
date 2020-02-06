import VueRouter from "vue-router";
import AccountsList from "../components/AccountsList";
import Index from "../components/Index";


const index = new VueRouter({
    mode: "history",
    routes: [
        {path: "/accounts", component: AccountsList},
        {path: "/index", component: Index}
    ]
});

export default index;