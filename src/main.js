import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'babel-polyfill'
import 'normalize.css'
import './assets/css/common.css'

Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
