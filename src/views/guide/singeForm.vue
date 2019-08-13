<template>
  <div class="app-container">
    <el-card class="box-card ">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="虚拟机名称">
          <el-input v-model="form.vmName" />
        </el-form-item>
        <el-form-item label="选择镜像">
          <el-select
            v-model="form.imageName"
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
          <el-button type="success" @click="submitUpload">上传新镜像</el-button>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="/image/file"
            :on-preview="handlePreview"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >

            <!--            <div slot="tip" class="el-upload__tip">只能上传img文件，且不超过5G</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="磁盘大小(GB)">
          <el-input-number v-model="form.diskSize" controls-position="right" :min="1" :step="10" />
        </el-form-item>
        <el-form-item label="硬件信息">
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
          <el-button type="success" size="mini">编辑</el-button>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <!--          <el-button>取消</el-button>-->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getList } from '@/api/image'
export default {
  name: 'SingeForm',
  data() {
    return {
      form: {
        diskSize: 20
      },
      value: [],
      list: [],
      fileList: [],
      tableData: [

      ]
    }
  },
  created() {
    this.getImageList()
    this.xml2js()
    // this.list = this.states.map(item => {
    //   return { value: item, label: item }
    // })
  },
  methods: {
    xml2js() {
      const xml = "<domain type='kvm'>\n" +
    '    <name>kvmdemo</name> <!--名称必须唯一-->\n' +
    '    <uuid>c6e408f3-7750-47ca-8bd1-d19837271472</uuid> <!--uuid必须唯一，可使用 java.util.UUID 随机生成-->\n' +
    "    <memory unit='MiB'>512</memory> <!--最大可用内存配置-->\n" +
    "    <currentMemory unit='MiB'>512</currentMemory>\n" +
    "    <vcpu placement='static'>1</vcpu> <!--配置cpu-->\n" +
    '    <os>\n' +
    "        <type arch='x86_64' machine='pc'>hvm</type>\n" +
    "        <boot dev='hd'/> <!--硬盘启动-->\n" +
    "        <boot dev='cdrom'/> <!--光驱启动-->\n" +
    '    </os>\n' +
    '    <features>\n' +
    '        <acpi/>\n' +
    '        <apic/>\n' +
    '        <pae/>\n' +
    '    </features>\n' +
    "    <clock offset='localtime'/>\n" +
    '    <on_poweroff>destroy</on_poweroff>\n' +
    '    <on_reboot>restart</on_reboot>\n' +
    '    <on_crash>restart</on_crash>\n' +
    '    <devices>\n' +
    '        <emulator>/usr/bin/qemu-system-x86_64</emulator> <!--模拟器所在路径，视自己情况配置-->\n' +
    "        <disk type='file' device='disk'>\n" +
    "            <driver name='qemu' type='qcow2'/>\n" +
    "            <source file='/var/lib/libvirt/images/kvmdemo.qcow2'/> <!--虚拟硬盘配置，这个地方填生成的镜像文件所在的路径即可-->\n" +
    "            <target dev='hda' bus='ide'/>\n" +
    '        </disk>\n' +
    "        <!--<disk type='file' device='cdrom'>\n" +
    "            <source file='/var/lib/libvirt/images/ubuntu-16.04-desktop-amd64.iso'/>\n" +
    "            <target dev='hdb' bus='ide'/>\n" +
    '            <readonly/>\n' +
    '        </disk>-->\n' +
    "        <interface type='bridge'> <!--网络配置，本示例配置成桥接模式-->\n" +
    "            <mac address='52:54:00:f4:06:03'/> <!--mac 地址必须唯一-->\n" +
    "            <source bridge='br0'/>\n" +
    '        </interface>\n' +
    "        <console type='pty'> <!--控制台配置，如果需要使用 virsh 命令登陆虚拟机，则必须添加-->\n" +
    "            <target port='0'/>\n" +
    '        </console>\n' +
    "        <input type='tablet' bus='usb'/>\n" +
    "        <input type='mouse' bus='ps2'/>\n" +
    "        <input type='keyboard' bus='ps2'/>\n" +
    "        <graphics type='vnc' autoport='yes' keymap='en-us'\n" +
    "                  listen='0.0.0.0'/> <!--VNC配置，autoport=\"yes\"表示自动分配VNC端口，推荐使用，listen=\"0.0.0.0\"表示监听所有IP-->\n" +
    '        <memballoon model="virtio"> <!--内存监控配置，添加此配置，才能正常取得内存使用情况-->\n' +
    '            <stats period="10"/><!--每10s钟收集一次-->\n' +
    '        </memballoon>\n' +
    '    </devices>\n' +
    '</domain>'
      var jsobj = this.$x2js.xml2js(xml)
      console.log(jsobj)
      this.tableData.push({ device: '内存', abstract: jsobj.domain.currentMemory.__text + jsobj.domain.currentMemory._unit })
      this.tableData.push({ device: '处理器', abstract: jsobj.domain.vcpu.__text })
      this.tableData.push({ device: '网络适配器', abstract: jsobj.domain.devices.interface._type })
      // this.tableData.push({ device: '硬盘', abstract: this.form.diskSize + ' GB' })
      console.log(this.tableData)
    },
    getImageList() {
      getList().then(response => {
        // this.states = response.result
        this.list = response.result.map(item => {
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
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePreview(file) {
      console.log(file)
    },
    /** * 提交**/
    onSubmit() {
      console.log(this.form)
    }
  }

}
</script>

<style scoped>
  /*.text {*/
  /*  font-size: 14px;*/
  /*}*/

  /*.item {*/
  /*  margin-bottom: 18px;*/
  /*}*/

  /*.clearfix:before,*/
  /*.clearfix:after {*/
  /*  display: table;*/
  /*  content: "";*/
  /*}*/
  /*.clearfix:after {*/
  /*  clear: both*/
  /*}*/

  .box-card {
    width: 520px;
  }
</style>
