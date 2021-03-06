import Vue from 'vue'
import Router from 'vue-router'

// 首页
import Index from '@/views/Index';
// 登录
import Login from '@/views/Login';
// 注册
import Register from '@/views/Register';
// Home
import Home from '@/views/Home';
// /Home/Post
import HomePost from '@/views/Home/Post';
// /Home/Video
import HomeVideo from '@/views/Home/Video';
// /Home/Live
import HomeLive from '@/views/Home/Live';
// /Home/Resume
import HomeResume from '@/views/Home/Resume';
// /Home/Interview
import HomeInterview from '@/views/Home/Interview';

// post、live、video、interview、recruitment
import Interview from '@/views/Interview';
import Live from '@/views/Live';
import Post from '@/views/Post';
import Recruitment from '@/views/Recruitment';
import Video from '@/views/Video';

// 发布文章
import NewPost from '@/views/NewPost';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: '/Post',
      children: [
        {path: '/Post', name: 'Post', component: Post,},
        {path: '/Video', name: 'Video', component: Video},
        {path: '/Live', name: 'Live', component: Live},
        {path: '/Recruitment', name: 'Recruitment', component: Recruitment},
        {path: '/Interview', name: 'Interview', component: Interview},
        {
          path: '/Home',
          name: 'Home',
          component: Home,
          redirect: '/Home/Post',
          children: [
            {path: '/Home/Post', name: 'HomePost', component: HomePost},
            {path: '/Home/Video', name: 'HomeVideo', component: HomeVideo},
            {path: '/Home/Live', name: 'HomeLive', component: HomeLive},
            {path: '/Home/Resume', name: 'HomeResume', component: HomeResume},
            {path: '/Home/Interview', name: 'HomeInterview', component: HomeInterview},
          ]
        },
        {path: '/NewPost', name: 'NewPost', component: NewPost}
      ],
    },
    {path: '/Login', name: 'Login', component: Login},
    {path: '/Register', name: 'Register', component: Register},
  ]
})
