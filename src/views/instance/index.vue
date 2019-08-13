<template>
  <div class="app-container">
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
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getList } from '@/api/host'

export default {
  name: 'Instance',
  data() {
    return {
      filterText: '',
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        },
        {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
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
      hostList: []
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
        console.log('getList', list)
      }).catch(() => {
        this.$message('无法完成当前请求')
      })
      console.log('return', list)
      return list
    },
    // 树 过滤方法
    filterNode(value, data) {
      if (!value) { return true }
      return data.label.indexOf(value) !== -1
    },
    // 树 加载节点方法
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ label: '主机' }])
      }
      if (node.level === 1) {
        return resolve(this.formatHostData(await this.sendGetHostRequest()))
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
      console.log('format', list, resultList)
      return resultList
    }

  }
}
</script>

<style scoped>
  .host-list > .text {
    font-size: 14px;
  }

  .host-list > .item {
    margin-bottom: 18px;
  }

  .host-list > .clearfix:before,
  .host-list > .clearfix:after {
    display: table;
    content: "";
  }

  .host-list > .clearfix:after {
    clear: both
  }

  .box-card ,.host-list{
    width: 240px;
  }
</style>
