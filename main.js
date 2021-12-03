import Vue from 'vue'
import App from './App'

// vuex
import store from './store'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'

import mixin from './common/mixin'

// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from './polyfill/polyfill';
Polyfill.init();

// 全局mixins，用于实现setData等功能，请勿删除！';
import Mixin from './polyfill/mixins';

Vue.mixin(Mixin);

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
    // #endif

Vue.mixin(mixin)

const app = new Vue({
    store,
    ...App
})

// 引入请求封装
require('./util/request/index')(app)

app.$mount()

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
    const app = createSSRApp(App);
    app.mixin(Mixin);
    return {
        app
    };
}
// #endif