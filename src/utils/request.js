import axios from 'axios';
import {Notice, LoadingBar} from 'view-design';

// 一个 axios 实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:7788/',
  withCredentials: true,  // send cookies when cross-domain requests
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  timeout: 5000,  // request timeout
});

// request 拦截器
service.interceptors.request.use();

// response 拦截器
service.interceptors.response.use(
  res => {
    return res.data;
  },
  err => {
    Notice.error({
      title: '网络错误',
      desc: '小蜜蜂飞到了电波到不了的地方',
      duration: 3
    });

    LoadingBar.error();

    return err.data;
  }
);

export default service;
