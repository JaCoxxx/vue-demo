import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "about" */ "./views/Home")
    },
    {
      path: "/hand-writing",
      name: "handWriting",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/HandWritingBoard")
    }
  ]
});
