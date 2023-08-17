import App from './App'
import module from './ajax/api/index.js'
import userRuleMixin from './common/rulesMixin.js'
import commonMixin from './common/commonMixin.js'
import store from './store/index.js'
//引入路由相关组件
import {router,RouterMount} from './router.js'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false

// 将module挂载到Vue原型中
Vue.prototype.$http = module

Vue.use(userRuleMixin)
Vue.use(commonMixin)
Vue.use(router)
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
// app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,router,'#app')
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif