<template>
  <el-form ref="form" :model="form">
    <el-form-item>
      <el-select
        v-model="value"
        filterable
        reserve-keyword
        placeholder="请输入关键词"
      >
        <el-option
          v-for="item in list"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-upload
        ref="upload"
        class="upload-demo"
        action="/image/file"
        :on-preview="handlePreview"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传新镜像</el-button>
        <div slot="tip" class="el-upload__tip">只能上传img文件，且不超过5G</div>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script>
import { getList } from '@/api/image'
export default {
  name: 'ImageView',
  data() {
    return {
      form: {},
      radioImage: 'select',
      options: [],
      value: [],
      list: [],
      loading: false,
      states: ['Alabama', 'Alaska', 'Arizona',
        'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida',
        'Georgia', 'Hawaii', 'Idaho', 'Illinois',
        'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana',
        'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania',
        'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas',
        'Utah', 'Vermont', 'Virginia',
        'Washington', 'West Virginia', 'Wisconsin',
        'Wyoming'],
      fileList: []
    }
  },
  created() {
    this.getImageList()
    // this.list = this.states.map(item => {
    //   return { value: item, label: item }
    // })
  },
  methods: {
    getImageList() {
      getList().then(response => {
        this.states = response.result
        this.list = this.states.map(item => {
          return { value: item, label: item }
        })
      }).catch(() => {
        this.$message('无法完成当前请求')
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },

    /** 上传**/
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handlePreview(file) {
      console.log(file)
    }
  }

}
</script>

<style scoped>

</style>
