import * as domainRequest from '@/api/domain'

const state = {
  domainListMap: new Map()
}

const mutations = {
  SET_DOMAIN_LIST: (state, map) => {
    state.domainListMap = map
  },
  SET_DOMAIN: (state, param) => {
    const { hostId, domain } = param
    const list = state.domainListMap.get(hostId)
    let index = -1
    for (let i = 0; i < list.length; i++) {
      const data = list[i]
      if (data.uuid === domain.uuid) {
        index = i
        break
      }
    }
    list.splice(index, 1, domain)
    state.domainListMap.set(list)
  }
}
const actions = {
  getDomains({ commit }, hostId) {
    return new Promise((resolve, reject) => {
      domainRequest.getList({ hostId: hostId }).then(response => {
        const { result } = response
        const map = new Map()
        map.set(hostId, result)
        // console.log(response, map)
        commit('SET_DOMAIN_LIST', map)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDomainInfo({ commit }, param) {
    return new Promise((resolve, reject) => {
      const { hostId, uuid } = param
      console.log('getDomainInfo', hostId, uuid)
      domainRequest.getByUUID(hostId, uuid).then(response => {
        const { result } = response
        console.log(response, result)
        commit('SET_DOMAIN', { hostId: hostId, domain: result })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
