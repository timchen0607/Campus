import { createRouter, createWebHistory } from "vue-router";
import Group from "./views/Group.vue";
import Article from "./views/Article.vue";
import newArticle from "./views/newArticle.vue";
import SignIn from "./views/SignIn.vue";
import Setting from "./views/Setting.vue";
import Logs from "./views/Logs.vue";
import Error from "./views/Error.vue";

const routes = [
  {
    path: "/",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/:groupID",
    name: "Group",
    component: Group,
  },
  {
    path: "/:groupID/newArticle",
    name: "newArticle",
    component: newArticle,
  },
  {
    path: "/:groupID/:articleID",
    name: "Article",
    component: Article,
  },
  {
    path: "/Logs",
    name: "Logs",
    component: Logs,
  },
  {
    path: "/Setting",
    name: "Setting",
    component: Setting,
  },
  {
    path: "/Error",
    name: "Error",
    component: Error,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
