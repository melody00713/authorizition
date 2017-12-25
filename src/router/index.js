import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/index.vue'
import Login from '@/views/login.vue'
import Error from '@/views/error.vue'

Vue.use(Router)

export default new Router({
  base: '/webadmin/',
  routes: [
    {
      path: '/index.html',
      hidden: true,
      redirect: '/login'
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/error/:code',
      name: 'error',
      component: Error
    },
    {
      path: '*',
      hidden: true,
      redirect: {path: '/error/404'}
    }
  ]
})
