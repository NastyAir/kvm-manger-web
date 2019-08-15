import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/domain',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    data
  })
}
export function getList(params) {
  return request({
    url: '/domain',
    method: 'get',
    params
  })
}
