import scene from "../components/scene.vue";

import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: scene,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
