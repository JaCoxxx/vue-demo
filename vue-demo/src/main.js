import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { List, Icon, Button, Popover, Slider, Row, Col } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.use(List);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Popover);
Vue.use(Slider);
Vue.use(Row);
Vue.use(Col);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
