<template>
  <el-dialog
    title="审核"
    :visible.sync="flag"
    width="600px"
    :before-close="closeHandler">
    <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="110px" size="medium">
      <el-form-item label="授权日期：" prop="date">
        <el-date-picker
          v-model="addForm.date"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="安装识别码：" prop="seriNumber">
        <el-input v-model="addForm.seriNumber"></el-input>
      </el-form-item>
      <el-form-item label="授权激活码：" prop="authorizationcode">
        <el-input type="textarea" v-model="addForm.authorizationcode" resize="none" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button size="medium" @click="closeHandler">取 消</el-button>
    <el-button size="medium" type="primary" @click="submitHandler">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
  import { willAudit, didAudit, getAuthCode } from '../../api/api'
  export default {
    data () {
      var handleValidateCode = (rule, value, callback) => {
        let name = rule.field === 'authorizationcode' ? '授权激活码' : '安装识别码'
        if (value === '') {
          callback(new Error(`请输入${name}`))
        } else if (!/^[0-9a-zA-Z_-]+$/.test(value)) {
          callback(new Error(`${name}必须为数字、字母、下划线或连接符`))
        } else if (value.length > (rule.field === 'authorizationcode' ? 1024 : 50)) {
          callback(new Error(`${name}不能超过${(rule.field === 'authorizationcode' ? 1024 : 50)}个字符`))
        } else {
          if (rule.field === 'seriNumber') {
            value !== this.seriNumber && this.getAuthorCodeHandler()
            this.seriNumber = value
          }
          callback()
        }
      }
      return {
        flag: false,
        seriNumber: '',
        addForm: {
          id: '',
          date: '',
          authorizationcode: '',
          seriNumber: ''
        },
        addFormRules: {
          date: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          authorizationcode: [
            {required: true, validator: handleValidateCode, trigger: 'blur'}
          ],
          seriNumber: [
            {required: true, validator: handleValidateCode, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      show (id) {
        willAudit({id: id}).then(res => {
          for(let k in this.addForm) {
            this.addForm[k] = k === 'serverNumber' ? parseInt(res[k]) : res[k]
          }
          this.seriNumber = res.seriNumber
          this.flag = true
        })
      },
      closeHandler () {
        this.$refs.addForm.resetFields()
        this.addForm = {
          id: '',
          date: '',
          authorizationcode: '',
          seriNumber: ''
        }
        this.flag = false
      },
      submitHandler () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            didAudit(this.addForm).then(res => {
              this.$emit('success')
              this.closeHandler()
            })
          }
        })
      },
      getAuthorCodeHandler () {
        getAuthCode().then(res => {
          this.addForm.authorizationcode = res
        })
      }
    }
  }
</script>
<style scoped>
  .el-date-editor.el-input { width: 100%;}
</style>
