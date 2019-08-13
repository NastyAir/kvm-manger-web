import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/image',
    method: 'get',
    params
  })
}
