<template>

  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="4">
        <el-card class="box-card host-list">
          <div slot="header" class="clearfix">
            <span>主机</span>
            <!--        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
          </div>
          <div class="text item">
            <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
            />
            <el-tree
              ref="tree"
              class="filter-tree"
              :load="loadNode"
              lazy
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="handleTreeClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">

        <el-card v-if="Object.keys(domain).length !== 0" class="box-card instance-info">
          <div slot="header" class="clearfix">
            <span>{{ domain.name }}</span>
          </div>
          <div class="text item">
            <el-container>
              <el-aside>
                <el-button> 启动虚拟机</el-button>
                <el-button> 编辑硬件配置</el-button>

                <el-divider content-position="left">设备详情</el-divider>
                <el-table
                  :data="tableData"
                  border
                  size="mini"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="device"
                    label="设备"
                  />
                  <el-table-column
                    prop="abstract"
                    label="摘要"
                  />
                </el-table>
                <el-divider content-position="left">虚拟机详细信息</el-divider>
                状态：{{ domain.info.state }}
              </el-aside>
              <el-main>
                <iframe :src="vncUrl" style="width: 1028px;height: 798px"/>
              </el-main>
            </el-container>
          </div>
        </el-card>
        <el-card v-else class="box-card instance-info">
          <div slot="header" class="clearfix">
            <span>首页</span>
          </div>
          <div class="text item">
            <el-button>快速创建新的虚拟机</el-button>
            <el-button>刷新当前主机</el-button>
            <el-button>连接远程主机</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getList } from '@/api/host'
import * as domainRequest from '@/api/domain'

export default {
  name: 'Instance',
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      /**
       *  主机查询条件
       */
      queryFrom: {
        hostName: '',
        currentPage: 0,
        pageSize: 100
      },
      hostList: [],
      /**
       * 虚拟机详情
       */
      domain: {
        /* id: 0,
        name: '',
        uuid: '',
        XMLDesc: '',
        info: {
          cpuTime: 0,
          maxMem: 0,
          memory: 0,
          nrVirtCpu: 1,
          state: 'VIR_DOMAIN_RUNNING'
        }*/
      },
      tableData: [],
      vncUrl: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  methods: {
    // 获取主机列表数据
    async sendGetHostRequest() {
      let list = []
      await getList(this.queryFrom).then(response => {
        list = response.result.content
        // console.log('getList', list)
      }).catch(() => {
        this.$message('无法完成当前请求')
      })
      // console.log('return', list)
      return list
    },
    async sendGetDomainRequest(hostId) {
      let list = []
      await domainRequest.getList({ hostId: hostId }).then(response => {
        list = response.result
        // console.log('getList', list)
      }).catch(() => {
        this.$message('无法完成当前请求')
      })
      // console.log('return', list)
      return list
    },
    // 树 过滤方法
    filterNode(value, data) {
      if (!value) { return true }
      return data.label.indexOf(value) !== -1
    },
    handleTreeClick(data, node, self) {
      if (node.level === 3) {
        this.domain = data

        this.vncUrl = 'http://10.6.30.105:8888/vnc_lite.html?host=10.6.30.105&port=6080&path=websockify%2f%3ftoken=' + data.uuid
        this.setTableData(data.XMLDesc)
      }
    },
    setTableData(xml) {
      var jsobj = this.$x2js.xml2js(xml)
      this.tableData = []
      this.tableData.push({ device: '内存', abstract: jsobj.domain.currentMemory.__text / 1024 + 'MB' })
      this.tableData.push({ device: '处理器', abstract: jsobj.domain.vcpu.__text })
      this.tableData.push({ device: '网络适配器', abstract: jsobj.domain.devices.interface._type })
      // this.tableData.push({ device: '硬盘', abstract: jsobj.domain.devices.disk[0] + ' GB' })
    },
    // 树 加载节点方法
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ label: '主机' }])
      }
      if (node.level === 1) {
        return resolve(this.formatHostData(await this.sendGetHostRequest()))
      }
      if (node.level === 2) {
        // console.log(node)
        return resolve(this.formatInstanceData(await this.sendGetDomainRequest(node.data.id)))
      }
    },
    // 主机 数据格式化
    formatHostData(list) {
      // const list = data.result.content
      const resultList = []
      for (let i = 0; i < list.length; i++) {
        const host = list[i]
        const obj = {
          id: host.id,
          label: host.name,
          leaf: false
        }
        resultList.push(obj)
      }
      // console.log('format', list, resultList)
      return resultList
    },
    // 虚拟机 数据格式化
    formatInstanceData(list) {
      // const list = data.result.content
      const resultList = []
      for (let i = 0; i < list.length; i++) {
        const instance = list[i]
        const obj = {
          id: instance.id,
          label: instance.name,
          leaf: true,
          name: instance.name,
          uuid: instance.uuid,
          XMLDesc: instance.XMLDesc,
          info: instance.info
        }
        resultList.push(obj)
      }
      // console.log('format', list, resultList)
      return resultList
    }

  }
}
</script>

<style scoped>
  /*.host-list > .text {*/
  /*  font-size: 14px;*/
  /*}*/

  /*.host-list > .item {*/
  /*  margin-bottom: 18px;*/
  /*}*/

  /*.host-list > .clearfix:before,*/
  /*.host-list > .clearfix:after {*/
  /*  display: table;*/
  /*  content: "";*/
  /*}*/

  /*.host-list > .clearfix:after {*/
  /*  clear: both*/
  /*}*/

  .host-list{
    width: 100%;
  }
</style>
