import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/storagePool',
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

export function info(hostId, poolName) {
  return request({
    url: '/storagePool/host/' + hostId + '/name/' + poolName,
    method: 'get'
  })
}
