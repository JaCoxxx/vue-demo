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
        source:
          "https://github.com/JaCoxxx/vue-demo/blob/master/vue-demo/src/views/HandWritingBoard/index.vue",
        phone: true
      },
      {
        name: "手写板2.0",
        path: "/hand-writing2",
        description:
          "移动端手写板插件，增加更改画笔粗细，画笔颜色，橡皮擦，撤销还原等功能。",
        source:
          "https://github.com/JaCoxxx/vue-demo/blob/master/vue-demo/src/views/HandWritingBoard2/index.vue",
        phone: true
      }
    ],
    searchList: []
  },
  getters: {
    searchList: state => val =>
      state.demoList.filter(item => item.name.includes(val))
  },
  mutations: {
    SET_DEMO_LIST(state, payload) {
      state.demoList = [...state.demoList, payload];
    },
    SET_SEARCH_LIST(state, payload) {
      state.searchList = [...payload];
    }
  },
  actions: {
    setDemoList({ commit }, payload) {
      commit("SET_DEMO_LIST", payload);
    },
    setSearchList({ commit }, payload) {
      commit("SET_SEARCH_LIST", payload);
    }
  }
});
