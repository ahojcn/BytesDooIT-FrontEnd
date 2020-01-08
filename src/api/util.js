import request from '@/utils/request';

// 图片验证码
export function verify_code_img() {
  return request({
    url: 'api/util/verify_code_img/',
    method: 'get',
    responseType: 'blob'
  })
}
