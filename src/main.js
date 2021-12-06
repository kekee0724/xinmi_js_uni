import App from '../App.vue'
import router from './router'
import store from '../store'
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

import 'vant/lib/index.css'
import request from '../static/common/request'
import '../static/common/flexible'

// 引入 Vant 基础组件及弹窗
import { Button, Cell, CellGroup, Icon, Row, Col, Popup, Toast, Dialog } from 'vant'

Vue.use(Button).use(Cell).use(CellGroup).use(Icon).use(Row).use(Col).use(Popup)
// 使用Image  会保install 错误,可能是测试版本的原因
// 在 Vue 的 prototype 上挂载 $toast 方法，便于在组件内调用(自动挂载,真机出现问题)
Vue.prototype.$toast = Toast
Vue.prototype.$dialog = Dialog
Vue.prototype.$request = request
Vue.prototype.$store = store
Vue.prototype.$adpid = '1111111111'
Vue.prototype.$backgroundAudioData = {
  playing: false,
  playTime: 0,
  formatedPlayTime: '00:00:00'
}
App.mpType = 'app'

router.beforeEach((to, from, next) => {
  // 统计代码
//   window._hmt.push(['_trackPageview', to.fullPath])
  next()
})

const app = new Vue({
  store,
  router,
  render: h => h(App),
//   ...App
})
app.$mount('#app')

// #endif

// #ifdef VUE3
// import {
//   createSSRApp
// } from 'vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   app.use(store)
//   app.config.globalProperties.$adpid = '1111111111'
//   app.config.globalProperties.$backgroundAudioData = {
//     playing: false,
//     playTime: 0,
//     formatedPlayTime: '00:00:00'
//   }
//   return {
//     app
//   }
// }
// #endif