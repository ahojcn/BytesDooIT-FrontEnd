import axios from 'axios'

// 一个 axios 实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
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
    return err.data;
  }
);

export default service;
