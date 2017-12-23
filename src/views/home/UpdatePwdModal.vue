<template>
  <el-dialog
    title="修改密码"
    :visible.sync="flag"
    :before-close="closeHandler"
    width="600px">
    <el-form ref="modifyForm" :model="modifyForm" :rules="modifyFormRules" size="medium" label-width="100px">
      <el-form-item label="旧密码：" prop="oldPwd">
        <el-input type="password" v-model="modifyForm.oldPwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPwd">
        <el-input type="password" v-model="modifyForm.newPwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="reNewPwd">
        <el-input type="password" v-model="modifyForm.reNewPwd" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="closeHandler">取 消</el-button>
      <el-button size="medium" type="primary" @click="submitModifyForm('modifyForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { modifyPwd } from '../../api/api'
  export default {
    props: ['username'],
    data () {
      var validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(value)) {
          callback(new Error('密码必须为6-18位数字和字母组成'))
        } else {
          callback()
        }
      }
      var validateRePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.modifyForm.newPwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        flag: false,
        modifyForm: {
          oldPwd: '',
          newPwd: '',
          reNewPwd: ''
        },
        modifyFormRules: {
          oldPwd: [
            {required: true, message: '请输入旧密码', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
          ],
          newPwd: [
            {required: true, validator: validatePwd, trigger: 'blur'}
          ],
          reNewPwd: [
            {required: true, validator: validateRePwd, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      show () {
        this.flag = true
      },
      submitModifyForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyPwd({
              username: this.username,
              oldPwd: this.modifyForm.oldPwd,
              newPwd: this.modifyForm.newPwd
            }).then(res => {
              this.$message({
                type: 'success',
                message: '成功修改密码'
              })
              this.$router.push('/login')
            })
          } else {
            return false
          }
        })
      },
      closeHandler () {
        this.$refs.modifyForm.resetFields()
        this.flag = false
      }
    }
  }
</script>
<style scoped>
  .el-select {width: 100%;}
</style>
