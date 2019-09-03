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

export function del(params) {
  return request({
    url: '/image/file',
    method: 'delete',
    params
  })
}

export function batchDel(fileNames) {
  return request({
    url: '/image/file/batch',
    method: 'delete',
    params: {
      fileNames: fileNames
    },
    paramsSerializer: params => {
      const yourNewParams = params.fileNames.map(_ => `fileNames=${_}`).join('&')
      console.log(yourNewParams)
      return yourNewParams
    }
  })
}
