import Vue from 'vue'
import Router from 'vue-router'

// 首页
import Index from '@/views/Index';
// 登录
import Login from '@/views/Login';
// 注册
import Register from '@/views/Register'
// home
import Home from '@/views/Home'

// post、live、video、interview、recruitment
import Interview from '@/views/Interview'
import Live from '@/views/Live'
import Post from '@/views/Post'
import Recruitment from '@/views/Recruitment'
import Video from '@/views/Video'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: '/Post',
      children: [
        {
          path: '/Post',
          name: 'Post',
          component: Post
        },
        {
          path: '/Video',
          name: 'Video',
          component: Video
        },
        {
          path: '/Live',
          name: 'Live',
          component: Live
        },
        {
          path: '/Recruitment',
          name: 'Recruitment',
          component: Recruitment
        },
        {
          path: '/Interview',
          name: 'Interview',
          component: Interview
        },
        {
          path: '/Home',
          name: 'Home',
          component: Home
        }
      ],
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
