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
            <el-button type="success">上传新镜像</el-button>
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
import { getTreeList } from '@/api/image'
import * as poolRequest from '@/api/storagePool'
import * as volRequest from '@/api/storageVolume'
import * as domainRequest from '@/api/domain'
import { getToken } from '@/utils/auth'

export default {
  name: 'SingeForm',
  data() {
    return {
      uploadHeader: { accessToken: getToken() },
      form: {
        vmName: '',
        imageName: '',
        hostId: 26,
        memorySize: 512,
        diskSize: 20,
        cpu: 1,
        networkInterfaceType: 'bridge'
      },
      value: [],
      list: [],
      fileList: [],
      tableData: [

      ],
      config: {
        poolPath: '/home/kvm/images/',
        poolName: 'defaultPool',
        volumePath: '/var/lib/libvirt/images/',
        imagePath: '/home/nfsdata/image/',
        emulatorPath: '/usr/libexec/qemu-kvm',
        macAddress: '',
        bridgeName: 'br0'
      },
      // StoragePool
      // poolName: '',
      // poolSize: 20,
      // poolPath: '',
      poolDesc: {
        'pool': {
          'name': 'virtimages',
          'source': {
            '__text': ''
          },
          'capacity': {
            '_unit': 'GiB',
            '__text': '40'
          },
          'allocation': '0',
          'target': {
            'path': '/home/kyyee/images',
            'permissions': {
              'mode': '0711',
              'owner': '0',
              'group': '0'
            }
          },
          '_type': 'dir'
        }
      },
      // volume
      // volumeName: '',
      // volumeSize: 20,
      volumePath: '',
      volumeDesc: {
        'volume': {
          'name': 'kvmdemo.qcow2',
          'source': {
            '__text': ''
          },
          'capacity': {
            '_unit': 'GiB',
            '__text': '10'
          },
          'allocation': '0',
          'target': {
            'path': '/var/lib/libvirt/images/kvmdemo.qcow2',
            'format': {
              '_type': 'qcow2'
            },
            'permissions': {
              'mode': '0600',
              'owner': '0',
              'group': '0'
            }
          },
          '_type': 'file'
        }
      },
      // vm
      vmDesc: {
        'domain': {
          'name': 'kvmdemo',
          'uuid': 'c6e408f3-7750-47ca-8bd1-d19837271472',
          'memory': {
            '_unit': 'MiB',
            '__text': '512'
          },
          'currentMemory': {
            '_unit': 'MiB',
            '__text': '512'
          },
          'vcpu': {
            '_placement': 'static',
            '__text': '1'
          },
          'os': {
            'type': {
              '_arch': 'x86_64',
              '_machine': 'pc',
              '__text': 'hvm'
            },
            'boot': [
              {
                '_dev': 'hd'
              },
              {
                '_dev': 'cdrom'
              }
            ]
          },
          'features': {
            'acpi': '',
            'apic': '',
            'pae': ''
          },
          'clock': {
            '_offset': 'localtime'
          },
          'on_poweroff': 'destroy',
          'on_reboot': 'restart',
          'on_crash': 'restart',
          'devices': {
            'emulator': '/usr/bin/qemu-system-x86_64',
            'disk': [
              {
                'driver': {
                  '_name': 'qemu',
                  '_type': 'qcow2'
                },
                'source': {
                  '_file': '/var/lib/libvirt/images/kvmdemo.qcow2'
                },
                'target': {
                  '_dev': 'hda',
                  '_bus': 'ide'
                },
                '_type': 'file',
                '_device': 'disk'
              },
              {
                'source': {
                  '_file': '/var/lib/libvirt/images/ubuntu-16.04-desktop-amd64.iso'
                },
                'target': {
                  '_dev': 'hdb',
                  '_bus': 'ide'
                },
                'readonly': '',
                '_type': 'file',
                '_device': 'cdrom'
              }
            ],
            'interface': {
              'mac': {
                '_address': '52:54:00:f4:06:03'
              },
              'source': {
                '_bridge': 'br0'
              },
              '_type': 'bridge'
            },
            'console': {
              'target': {
                '_port': '0'
              },
              '_type': 'pty'
            },
            'input': [
              {
                '_type': 'tablet',
                '_bus': 'usb'
              },
              {
                '_type': 'mouse',
                '_bus': 'ps2'
              },
              {
                '_type': 'keyboard',
                '_bus': 'ps2'
              }
            ],
            'graphics': {
              '_type': 'vnc',
              '_autoport': 'yes',
              '_keymap': 'en-us',
              '_listen': '0.0.0.0'
            },
            'memballoon': {
              'stats': {
                '_period': '10'
              },
              '_model': 'virtio'
            }
          },
          '_type': 'kvm'
        }
      }
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
      // var jsobj = this.vmDesc
      this.tableData.push({ device: '内存', abstract: this.form.memorySize + 'MB' })
      this.tableData.push({ device: '处理器', abstract: this.form.cpu })
      this.tableData.push({ device: '网络适配器', abstract: this.form.networkInterfaceType })
      this.tableData.push({ device: '硬盘', abstract: this.form.diskSize + ' GB' })
      // console.log(this.tableData)
      console.log(this.randomMac())
    },
    getImageList() {
      getTreeList().then(response => {
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
    handleSuccess(response, file, fileList) {
      if (response.success) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message.error(`上传失败`)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePreview(file) {
      console.log(file)
    },
    checkPool() {
      let r
      poolRequest.info(this.form.hostId, this.config.poolName).then(response => {
        console.log(response)
        r = response
      }).catch((err) => {
        console.log(err)
      })
      return r
    },
    /** * 提交**/
    async onSubmit() {
      let error = true
      let hasPool = true
      await poolRequest.info(this.form.hostId, this.config.poolName).then(response => {
        if (!response.success) {
          hasPool = false
        }
        error = false
      }).catch((err) => {
        console.log(err)
      })
      if (error) {
        this.$message('查询存储状态失败，请联系管理员')
        return
      } else {
        hasPool = true
        error = true
      }
      if (!hasPool) {
      // 创建存储池
        await poolRequest.add({
          hostId: this.form.hostId,
          xmlDesc: this.getPoolXml()
        }).then(response => {
        // this.states = response.result
          this.$message('创建存储池' + (response.success ? '成功' : '失败'))
          error = !response.success
        }).catch(() => {
          this.$message('无法完成当前请求')
          error = true
        })

        if (error) {
          this.$message('创建存储池失败，请联系管理员')
          return
        } else {
          error = true
        }
      }
      // 创建存储卷
      await volRequest.add({
        hostId: this.form.hostId,
        poolName: this.config.poolName,
        volumeName: this.volumeDesc.volume.name,
        xmlDesc: this.getVolumeXml()
      }).then(response => {
        this.$message('创建存储卷' + (response.success ? '成功' : '失败'))
        error = false
      }).catch(() => {
        this.$message('无法完成当前请求')
        error = true
      })
      if (error) {
        this.$message('创建存储卷失败，请联系管理员')
        return
      } else {
        error = true
      }
      // 创建虚拟机
      await domainRequest.add({
        hostId: this.form.hostId,
        xmlDesc: this.getVmXml()
      }).then(response => {
        // this.states = response.result
        this.$message('创建虚拟机' + (response.success ? '成功' : '失败'))
      }).catch(() => {
        this.$message('无法完成当前请求')
        error = true
      })
    },
    getPoolXml() {
      this.poolDesc.pool.name = this.config.poolName
      this.poolDesc.pool.capacity.__text = this.form.diskSize
      this.poolDesc.pool.target.path = this.config.poolPath
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + this.$x2js.js2xml(this.poolDesc)
    },
    getVolumeXml() {
      this.volumeDesc.volume.name = this.getUuid() + '.qcow2'
      this.volumeDesc.volume.capacity.__text = this.form.diskSize
      this.volumeDesc.volume.target.path = this.config.poolPath + this.volumeDesc.volume.name
      this.volumePath = this.volumeDesc.volume.target.path
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + this.$x2js.js2xml(this.volumeDesc)
    },
    getVmXml() {
      this.vmDesc.domain.name = this.form.vmName
      this.vmDesc.domain.uuid = this.getUuid()
      this.vmDesc.domain.memory.__text = this.form.memorySize
      this.vmDesc.domain.vcpu.__text = this.form.cpu
      this.vmDesc.domain.devices.emulator = this.config.emulatorPath
      this.vmDesc.domain.devices.disk[0].source._file = this.volumePath
      this.vmDesc.domain.devices.disk[1].source._file = this.config.imagePath + this.form.imageName
      this.vmDesc.domain.devices.interface.mac._address = this.randomMac()
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + this.$x2js.js2xml(this.vmDesc)
    },
    getMacAddress() {
      return ''
    },
    randomMac() {
      const mac = [
        (0x52).toString(16),
        (0x54).toString(16),
        (0x00).toString(16),
        Math.floor((Math.random() * 0xff)).toString(16),
        Math.floor((Math.random() * 0xff)).toString(16),
        Math.floor((Math.random() * 0xff)).toString(16)
      ]
      return mac.join(':')
    },
    getUuid() {
      var d = new Date().getTime()
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
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
