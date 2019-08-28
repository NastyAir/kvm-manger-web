<template>
  <div class="app-container">
    <el-card class="box-card ">
      <el-steps :active="active" finish-status="success">
        <el-step title="选择操作系统" />
        <el-step title="命名虚拟机" />
        <el-step title="磁盘容量" />
        <el-step title="自定义硬件" />
      </el-steps>
      <div v-if="active == 0">
        <ImageView />
      </div>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </el-card>
  </div>
</template>

<script>
import ImageView from '@/views/guide/image'
export default {
  name: 'Guide',
  components: {
    ImageView
  },
  data() {
    return {
      active: 0,
      stepNum: 4

    }
  },
  methods: {
    next() {
      if (this.active++ > (this.stepNum - 1)) this.active = 0
    }
  }
}
</script>

<style scoped>

</style>
