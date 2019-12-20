import Vue from 'vue'
import Router from 'vue-router'

// 首页
import Index from '@/views/Index';
// 登录
import Login from '@/views/Login';
// 注册
import Register from '@/views/Register'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
  ]
})
