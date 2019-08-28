<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryFrom" class="demo-form-inline">
      <el-form-item>

        <el-upload
          ref="upload"
          class="upload-demo"
          action="/image/file"
          :headers="uploadHeader"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :file-list="fileList"
        >
          <el-button
            size="mini"
            type="success"
          >上传
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="danger"
          @click="handleBatchDel()"
        >删除
        </el-button>
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/image/file"
          :headers="uploadHeader"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :file-list="fileList"
        >
          <!--            <div slot="tip" class="el-upload__tip">只能上传img文件，且不超过5G</div>-->
        </el-upload>
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
      <el-table-column label="镜像名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="大小" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.lastModified }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
import * as imageRequest from '@/api/image'
import { getToken } from '@/utils/auth'
export default {
  name: 'Images',
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
      isSubmiting: false,
      // 上传
      uploadHeader: { accessToken: getToken() },
      fileList: []
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
      imageRequest.getList(this.queryFrom).then(response => {
        this.list = response.result
        this.listLoading = false
        this.totalItem = response.result.totalElements
        this.currentPage = response.result.pageable.offset / response.result.pageable.pageSize + 1
        this.pageSize = response.result.pageable.pageSize
      }).catch(() => {
        this.$message('无法完成获取列表数据请求')
        this.listLoading = false
      })
    },
    // 发送删除请求
    sendDelRequest(name) {
      imageRequest.del({ filename: name }).then(response => {
        if (response.success) {
          this.$message({
            message: '镜像删除成功',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error('镜像删除失败。' + response.msg)
        }
      }).catch(() => {
        this.$message('无法完成镜像删除请求')
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
    // 删除按钮点击事件
    handleDelete(index, row) {
      // console.log(index, row)
      this.$confirm('此操作将永久删除该镜像, 是否继续?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.sendDelRequest(row.name)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    },
    // 上传
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSuccess(response, file, fileList) {
      if (response.success) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.fetchData()
      } else {
        this.$message.error(`上传失败`)
      }
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<style scoped>

</style>
