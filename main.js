import App from "./App";
import store from "./store";

// 引入全局uView
import uView from "@/uni_modules/uview-ui";
import mixin from "./common/mixin";

// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from "./polyfill/polyfill";
Polyfill.init();
// 全局mixins，用于实现setData等功能，请勿删除！';
import Mixin from "./polyfill/mixins";

import Vant from "vant";
// import 'vant/lib/index.css';
import { Notify } from "vant";

// #ifndef VUE3
import Vue from "vue";
// 全局注册
Vue.use(Vant);
Vue.use(Notify);
Vue.use(uView);

Vue.mixin(Mixin);
// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require("@/uni_modules/uview-ui/libs/mixin/mpShare.js");
Vue.mixin(mpShare);
// #endif
Vue.mixin(mixin);

Vue.config.productionTip = false;
Vue.prototype.$store = store;
App.mpType = "app";

const app = new Vue({
  store,
  ...App,
});

// 引入请求封装
require("./util/request/index")(app);

app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  app.use(store);
  app.use(Vant);
  app.use(Notify);
  app.use(uView);

  app.mixin(Mixin);
  // #ifdef MP
  // 引入uView对小程序分享的mixin封装
  const mpShare = require("@/uni_modules/uview-ui/libs/mixin/mpShare.js");
  app.mixin(mpShare);
  // #endif
  app.mixin(mixin);
  // 引入请求封装
  require("./util/request/index")(app);

  return {
    app,
  };
}
// #endif
