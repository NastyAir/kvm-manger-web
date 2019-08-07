import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/host',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: '/host',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/host/' + data.id,
    method: 'put',
    data
  })
}
export function del(id) {
  return request({
    url: '/host/' + id,
    method: 'delete'
  })
}
