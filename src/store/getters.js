const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  domainList: state => state.domain.domainListMap,
  getDomainByHostId: (state) => (hostId) => {
    return state.domain.domainListMap.get(hostId)
  },
  getDomainByHostIdAndId: (state, getters) => (hostId, uuid) => {
    const list = getters.getDomainByHostId(hostId)
    console.log('list', list, hostId, uuid)
    const result = list.filter(data => data.uuid === uuid)
    if (result.length > 0) {
      return result[0]
    } else {
      return {}
    }
  }
}
export default getters
