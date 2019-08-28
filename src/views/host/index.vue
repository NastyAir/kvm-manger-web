<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryFrom" class="demo-form-inline">
      <el-form-item>
        <el-button
          size="mini"
          type="success"
          @click="handleAdd()"
        >添加
        </el-button>

      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="danger"
          @click="handleBatchDel()"
        >删除
        </el-button>
      </el-form-item>
      <el-form-item label="主机名称">
        <el-input v-model="queryFrom.hostName" size="mini" placeholder="主机名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onQueryBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="主机名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="IP" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="getInfo(scope.row.id)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItem"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="IP" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="账户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isSubmiting" @click="handleDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="dialogInfoVisible">
      <template>
        <div :model="formView">
          <span>核心: </span>
          <span>{{ formView.cores }}</span>
          <el-divider />
          <span>CPU数: </span>
          <span>{{ formView.cpus }}</span>
          <el-divider />
          <span>存储: </span>
          <span>{{ formView.memory }}</span>
          <el-divider />
          <span>赫兹: </span>
          <span>{{ formView.mhz }}</span>
          <el-divider />
          <span>型号: </span>
          <span>{{ formView.model }}</span>
          <el-divider />
          <span>节点: </span>
          <span>{{ formView.nodes }}</span>
          <el-divider />
          <span>插口: </span>
          <span>{{ formView.sockets }}</span>
          <el-divider />
          <span>线程: </span>
          <span>{{ formView.threads }}</span>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { getList, add, edit, info, del, batchDel } from '@/api/host'

export default {
  name: 'Host',
  data() {
    return {
      // 列表数据
      list: null,
      // 列表是否正在加载中
      listLoading: true,
      multipleSelection: [],
      /**
                 *  分页相关
                 */
      currentPage: 0,
      totalItem: 0,
      pageSize: 10,
      /**
                 *  查询条件
                 */
      queryFrom: {
        hostName: '',
        currentPage: 0,
        pageSize: 10
      },
      /**
                 *  新增/编辑弹窗
                 */
      form: {
        name: '',
        ip: '',
        username: '',
        password: ''
      },
      formView: {
        cores: '',
        cpus: '',
        memory: '',
        mhz: '',
        model: '',
        nodes: '',
        sockets: '',
        threads: ''
      },
      dialogFormVisible: false,
      dialogInfoVisible: false,
      formLabelWidth: '120px',
      dialogTitle: '',
      isSubmiting: false
    }
  },
  // 创建完成 自动加载
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getList(this.queryFrom).then(response => {
        this.list = response.result.content
        this.listLoading = false
        this.totalItem = response.result.totalElements
        this.currentPage = response.result.pageable.offset / response.result.pageable.pageSize + 1
        this.pageSize = response.result.pageable.pageSize
      }).catch(() => {
        this.$message('无法完成当前请求')
        this.listLoading = false
      })
    },
    // 发送添加请求
    sendAddRequest() {
      this.isSubmiting = true
      add(this.form).then(response => {
        if (response.success) {
          this.$message({
            message: '主机添加成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.fetchData()
        } else {
          this.$message.error('主机添加失败。' + response.msg)
        }
        this.isSubmiting = false
      }).catch(() => {
        this.$message('无法完成当前请求')
        this.isSubmiting = false
      })
    },
    // 发送编辑请求
    sendEditRequest() {
      this.isSubmiting = true
      edit(this.form).then(response => {
        if (response.success) {
          this.$message({
            message: '主机修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.fetchData()
        } else {
          this.$message.error('主机修改失败。' + response.msg)
        }
        this.isSubmiting = false
      }).catch(() => {
        this.$message('无法完成当前请求')
        this.isSubmiting = false
      })
    },
    // 获取主机详情请求
    getInfo(id) {
      info(id).then(response => {
        console.log(response)
        this.dialogTitle = '详情'
        this.dialogInfoVisible = true
        this.formView = {
          cores: response.result.cores,
          cpus: response.result.cpus,
          memory: response.result.memory,
          mhz: response.result.mhz,
          model: response.result.model,
          nodes: response.result.nodes,
          sockets: response.result.sockets,
          threads: response.result.threads
        }
        /* if (response.success) {
                        this.$message({
                            message: '主机删除成功',
                            type: 'success'
                        })
                        this.fetchData()
                    } else {
                        this.$message.error('主机删除失败。' + response.msg)
                    }*/
      }).catch(() => {
        this.$message('无法完成当前请求')
        this.listLoading = false
      })
    },
    // 发送删除请求
    sendDelRequest(id) {
      del(id).then(response => {
        if (response.success) {
          this.$message({
            message: '主机删除成功',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error('主机删除失败。' + response.msg)
        }
      }).catch(() => {
        this.$message('无法完成当前请求')
        this.listLoading = false
      })
    },
    // 发送批量删除请求
    sendBatchDelRequest(ids) {
      batchDel(ids).then(response => {
        if (response.success) {
          this.$message({
            message: '主机删除成功' + response.msg,
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error('主机删除失败。' + response.msg)
        }
      }).catch(() => {
        this.$message('无法完成当前请求')
        this.listLoading = false
      })
    },
    // 查询按钮 点击事件
    onQueryBtn() {
      this.queryFrom.currentPage = 0
      this.fetchData()
    },
    // 修改每页页数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.queryFrom.pageSize = val
      this.fetchData()
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.queryFrom.currentPage = val - 1
      this.fetchData()
      // console.log(`当前页: ${val}`)
    },
    // 编辑按钮点击事件
    handleEdit(index, row) {
      this.dialogTitle = '编辑'
      this.dialogFormVisible = true
      this.form = {
        name: row.name,
        ip: row.ip,
        username: row.username,
        password: row.password
      }
      this.form.id = row.id
    },
    // 删除按钮点击事件
    handleDelete(index, row) {
      // console.log(index, row)
      this.$confirm('此操作将永久删除该主机, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.sendDelRequest(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加按钮点击事件
    handleAdd() {
      this.dialogTitle = '添加'
      this.dialogFormVisible = true
      this.form = {
        name: '',
        ip: '',
        username: '',
        password: ''
      }
    },
    // 批量删除按钮点击事件
    handleBatchDel() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('当前没有选中任何对象，无法进行删除。')
        return
      }
      this.$confirm('此操作将永久删除选中主机, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.sendBatchDelRequest(this.getDelId(this.multipleSelection))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getDelId(list) {
      const idList = []
      for (let i = 0; i < list.length; i++) {
        const obj = list[i]
        idList.push(obj.id)
      }
      return idList
    },
    // 新增/编辑 确认按钮事件
    handleDialogSubmit() {
      if (this.dialogTitle === '添加') {
        this.sendAddRequest()
      } else if (this.dialogTitle === '编辑') {
        this.sendEditRequest()
      }
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>

</style>
