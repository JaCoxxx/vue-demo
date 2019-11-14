import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "home" */ "./views/Home")
    },
    {
      path: "/hand-writing",
      name: "handWriting",
      component: () =>
        import(/* webpackChunkName: "board1" */ "./views/HandWritingBoard")
    },
    {
      path: "/hand-writing2",
      name: "handWriting2",
      component: () =>
        import(/* webpackChunkName: "board2" */ "./views/HandWritingBoard2")
    },
    {
      path: "/hand-writing3",
      name: "handWriting3",
      component: () =>
        import(/* webpackChunkName: "board3" */ "./views/HandWritingBoard3")
    }
  ]
});
