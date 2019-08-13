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

export function info(id) {
  return request({
    url: '/host/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/host/' + id,
    method: 'delete'
  })
}

export function batchDel(ids) {
  return request({
    url: '/host/batch',
    method: 'delete',
    params: {
      ids: ids
    },
    paramsSerializer: params => {
      const yourNewParams = params.ids.map(_ => `ids=${_}`).join('&')
      console.log(yourNewParams)
      return yourNewParams
    }
  })
}
