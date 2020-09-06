import Vue from "vue";
import Router from "vue-router";
import ObjectDetection from "./views/ObjectDetection.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/object-detection",
      name: "objectDetection",
      component: ObjectDetection,
    },
    {
      path: "*",
      redirect: "/object-detection",
    },
  ],
});
