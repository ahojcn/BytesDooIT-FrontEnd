import request from '@/utils/request';

// 获取用户信息
export function getUserInfo() {
  return request({
    url: 'api/user/session/',
    method: 'get'
  })
}

// 登录
export function login(data) {
  return request({
    url: 'api/user/session/',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: 'api/user/session/',
    method: 'delete',
  })
}

// 注册
export function register(data) {
  return request({
    url: 'api/user/',
    method: 'post',
    data
  })
}

// 重发激活邮件
export function active(data) {
  return request({
    url: 'api/user/active/',
    method: 'post',
    data
  })
}
