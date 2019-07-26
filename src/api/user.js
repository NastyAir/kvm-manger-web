import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
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

export function getInfo(token) {
  return request({
    url: '/user',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
