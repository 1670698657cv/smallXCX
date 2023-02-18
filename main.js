
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import { $http } from '@escook/request-miniprogram'

Vue.config.productionTip = false
// 将按需导入的 $http 挂载到 wx 顶级对象之上，方便全局调用
uni.$http=$http
// 请求的根路径
$http.baseUrl='https://api-hmugo-web.itheima.net/'
// 请求拦截器
   // 请求完成之前的显示，这个设置到的是 请求到了数据以后，例如因为网速慢，页面没有加载完成的时候显示
$http.beforeRequest=function(options){
  // showLoading显示转圈的动画
  uni.showLoading({
    title:'数据加载中...',
  })
}
//响应拦截器
// 请求完成之后做一些事情
$http.afterRequest = function () {
  // do something...
  // hideLoading不显示 转圈的动画
  uni.hideLoading({
  }),
  // 封装的展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif