import VueRouter from "vue-router";
import FinDashboard from "../components/FinDashboard";


const index = new VueRouter({
    mode: "history",
    routes: [
        {path: "/fin", component: FinDashboard}
    ]
});

export default index;