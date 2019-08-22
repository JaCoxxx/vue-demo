import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    demoList: [
      {
        name: "手写板",
        path: "/hand-writing",
        description: "移动端手写板插件，无额外功能。",
        phone: true
      },
      {
        name: "手写板2.0",
        path: "/hand-writing2",
        description: "移动端手写板插件，增加更改画笔粗细，画笔颜色功能。",
        phone: true
      }
    ]
  },
  mutations: {
    SET_DEMO_LIST(state, payload) {
      state.demoList = [...state.demoList, payload];
    }
  },
  actions: {
    setDemoList({ commit }, payload) {
      commit("SET_DEMO_LIST", payload);
    }
  }
});
