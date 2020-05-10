import VueRouter from "vue-router";
import AccountsList from "../components/AccountsList";
import IndicesList from "../components/IndicesList"
import IndexView from "../components/IndexView"
import GoalsList from "../components/GoalsList";
import GoalView from "../components/GoalView";

const index = new VueRouter({
    mode: "history",
    routes: [
        {path: "/accounts", component: AccountsList},
        {path: "/indices", component: IndicesList},
        {path: "/indices/:id", component: IndexView},
        {path: "/goals", component: GoalsList},
        {path: "/goals/:id", component: GoalView}
    ]
});

export default index;
