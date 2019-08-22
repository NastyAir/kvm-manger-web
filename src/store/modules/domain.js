import * as domainRequest from '@/api/domain'

const state = {
  domainList: new Map()
}

const mutations = {
  SET_DOMAIN_LIST: (state, map) => {
    state.domainList = map
  },
  SET_DOMAIN: (state,hostId, domain) => {
    state.domainList.get(hostId).set(domain)
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
  getDomainInfo({ commit }, hostId, uuid) {
    return new Promise((resolve, reject) => {
      domainRequest.getByUUID(hostId, uuid).then(response => {
        const { result } = response
        console.log(response, result)
        commit('SET_DOMAIN', hostId, result)
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
