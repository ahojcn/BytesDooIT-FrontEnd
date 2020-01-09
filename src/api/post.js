/**
 * 文章相关接口
 */

import request from '@/utils/request';

// 删除文章
export function delPost(data) {
  return request({
    url: 'api/post/draft/',
    method: 'post',
    data,
  })
}

// 获取自己的文章
export function selfPost(query) {
  return request({
    url: 'api/post/draft/',
    method: 'get',
    params: query
  })
}

// 文章中上传图片
export function uploadImg(data) {
  return request({
    url: 'api/post/img/',
    method: 'post',
    data
  })
}

// 新增文章
export function newPost(data) {
  return request({
    url: 'api/post/',
    method: 'post',
    data
  })
}

// 获取所有人的文章
export function getAllPost(query) {
  return request({
    url: 'api/post/',
    method: 'get',
    params: query
  })
}

// 获取用户的 post 分类列表
export function getPostCategory(query) {
  return request({
    url: 'api/post/category/',
    method: 'get',
    params: query
  })
}

// 投喂辣条
export function giveFood(data) {
  return request({
    url: 'api/post/food/',
    method: 'post',
    data
  })
}

// 点赞
export function giveLike(data) {
  return request({
    url: 'api/post/like/',
    method: 'post',
    data
  })
}
