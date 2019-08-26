import request from '@/utils/request'

export function getTreeList(params) {
  return request({
    url: '/image/treeList',
    method: 'get',
    params
  })
}
export function getList(params) {
  return request({
    url: '/image',
    method: 'get',
    params
  })
}
