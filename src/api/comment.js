/**
 * 评论相关接口
 */

import request from '@/utils/request';

// 新增评论
export function newComment(data) {
  return request({
    url: 'api/comment/',
    method: 'post',
    data
  })
}

// 获取评论
export function getComment(query) {
  return request({
    url: 'api/comment/',
    method: 'get',
    params: query
  })
}

// 评论点赞
export function likeComment(data) {
  return request({
    url: 'api/comment/like/',
    method: 'post',
    data
  })
}
