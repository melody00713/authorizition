<template>
  <el-dialog
    title="编辑授权"
    :visible.sync="flag"
    width="600px"
    :before-close="closeHandler">
    <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="100px" size="medium">
      <el-form-item label="合同编号：" prop="contractNumber">
        <el-input v-model="addForm.contractNumber"></el-input>
      </el-form-item>
      <el-form-item label="客户名称：" prop="name">
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="产品名称：" prop="productSeries">
        <el-select v-model="addForm.productSeries" placeholder="请选择">
          <el-option
            v-for="item in filter.product_series"
            :key="item.id"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品版本：" prop="version">
        <el-select v-model="addForm.version" placeholder="请选择">
          <el-option
            v-for="item in filter.product_version"
            :key="item.id"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品组件：" prop="productModule">
        <el-select v-model="addForm.productModule" placeholder="请选择">
          <el-option
            v-for="item in filter.product_model"
            :key="item.id"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量：" prop="superveneNumber">
        <el-input v-model.number="addForm.superveneNumber"></el-input>
      </el-form-item>
      <el-form-item label="许可：" prop="license">
        <el-input v-model="addForm.license"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="closeHandler">取 消</el-button>
      <el-button size="medium" type="primary" @click="submitHandler">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { detail, authEdit } from '../../api/api'
  export default {
    props: ['filter'],
    data () {
      var handleValidateContractNumber = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入合同编号'))
        } else if (!/^[0-9a-zA-Z_-]+$/.test(value)) {
          callback(new Error('合同编号必须为数字、字母、下划线或连接符'))
        } else if (value.length > 50) {
          callback(new Error('合同编号不能超过50个字符'))
        } else {
          callback()
        }
      }
      return {
        flag: false,
        addForm: {
          id: '',
          contractNumber: '',
          name: '',
          productSeries: '',
          version: '',
          productModule: '',
          superveneNumber: '',
          license: '',
          status: ''
        },
        addFormRules: {
          contractNumber: [
            {required: true, validator: handleValidateContractNumber, trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入客户名称', trigger: 'blur'},
            {max: 50, message: '客户名称不能超过50个字符', trigger: 'blur'}
          ],
          productSeries: [
            {required: true, message: '请选择产品名称', trigger: 'change'}
          ],
          version: [
            {required: true, message: '请选择产品版本', trigger: 'change'}
          ],
          productModule: [
            {required: true, message: '请选择产品组件', trigger: 'change'}
          ],
          superveneNumber: [
            {required: true, message: '请输入产品数量', trigger: 'blur'},
            {type: 'number', message: '产品数量必须为数字值'}
          ],
          license: [
            {required: true, message: '请输入产品许可', trigger: 'blur'},
            {max: 50, message: '许可不能超过50个字符', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      show (id) {
        detail(id).then(res => {
          for(let k in this.addForm) {
            this.addForm[k] = k === 'superveneNumber' ? parseInt(res[k]) : res[k]
          }
          this.flag = true
        })
      },
      closeHandler () {
        this.$refs.addForm.resetFields()
        this.addForm = {
          id: '',
          contractNumber: '',
          name: '',
          productSeries: '',
          version: '',
          productModule: '',
          superveneNumber: '',
          license: '',
          status: ''
        }
        this.flag = false
      },
      submitHandler () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            authEdit(this.addForm).then(res => {
              this.$emit('success')
              this.closeHandler()
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .el-select {width: 100%;}
</style>
