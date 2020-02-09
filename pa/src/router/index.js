import VueRouter from "vue-router";
import AccountsList from "../components/AccountsList";
import IndicesList from "../components/IndicesList"
import IndexView from "../components/IndexView"

const index = new VueRouter({
    mode: "history",
    routes: [
        {path: "/accounts", component: AccountsList},
        {path: "/indices", component: IndicesList},
        {path: "/indices/:id", component: IndexView}
    ]
});

export default index;
