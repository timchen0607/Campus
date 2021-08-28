import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Logs from "./views/Logs.vue";
import Setting from "./views/Setting.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/:groupID",
    name: "Group",
    component: Home,
  },
  {
    path: "/:groupID/Logs",
    name: "Logs",
    component: Logs,
  },
  {
    path: "/:groupID/:articleID",
    name: "Article",
    component: Home,
  },
  {
    path: "/Setting",
    name: "Setting",
    component: Setting,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
