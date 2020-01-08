import request from '@/utils/request';

// todo 接口整合
// 删除文章
export function delPost(data) {
  return request({
    url: 'api/post/draft/',
    method: 'post',
    data,
  })
}

// 获取自己的所有文章
export function selfAllPost(query) {
  return request({
    url: 'api/post/draft/',
    method: 'get',
    params: query
  })
}
