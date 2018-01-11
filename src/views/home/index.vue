<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <img src="../../assets/images/logo.png" alt="logo" class="header-logo">
          <span style="font-size: 16px;">EASTED AUTHORIZATION MANAGEMENT</span>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <div class="userinfo-inner">
            <span style="margin-right: 10px">欢迎，{{username}}</span>
            <span class="header-btn" @click="showModalHandler('updatePwdModal')">修改密码</span>
            <span class="header-btn" @click="logoutHandler">注销</span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row type="flex" justify="space-between" style="background: #e9ecef">
        <el-col :span="20">
          <el-form :inline="true" :model="tOptions" class="demo-form-inline" size="medium">
            <el-form-item>
              <el-input
                placeholder="请输入合同编号"
                prefix-icon="el-icon-search"
                v-model="tOptions.contractNumber">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="请输入客户名称"
                prefix-icon="el-icon-search"
                v-model="tOptions.name">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                type="date"
                placeholder="选择开始日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-model="tOptions.starDate">
              </el-date-picker>
              <span class="line">-</span>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                type="date"
                placeholder="选择结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-model="tOptions.endDate">
              </el-date-picker>
            </el-form-item>
            <el-button size="medium" type="primary" plain @click="clearFilterHandler">清除</el-button>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button size="medium" type="primary" @click="showModalHandler('addForm')" v-if="!auditor">申请授权</el-button>
          <el-button size="medium" type="primary" @click="tableDownHandler" v-if="auditor">导出</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="table"
        v-loading="table_loading"
        element-loading-text="拼命加载中"
        :data="data"
        style="width: 100%"
        @filter-change="filterHandler"
        size="medium"
        stripe>
        <el-table-column type="expand" v-if="auditor">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="合同编号">
                <span>{{ props.row.contractNumber || '-' }}</span>
              </el-form-item>
              <el-form-item label="客户名称">
                <span>{{ props.row.name || '-' }}</span>
              </el-form-item>
              <!--<el-form-item label="产品线">-->
                <!--<span>{{ props.row.productLine || '-' }}</span>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="产品名称">-->
                <!--<span>{{ props.row.product || '-' }}</span>-->
              <!--</el-form-item>-->
              <el-form-item label="产品名称">
                <span>{{ props.row.productSeries || '-' }}</span>
              </el-form-item>
              <el-form-item label="产品版本">
                <span>{{ props.row.version || '-' }}</span>
              </el-form-item>
              <el-form-item label="产品组件">
                <span>{{ props.row.productModule || '-' }}</span>
              </el-form-item>
              <el-form-item label="合同数量">
                <span>{{ props.row.superveneNumber || '-' }}</span>
              </el-form-item>
              <el-form-item label="许可">
                <span>{{ props.row.license || '-' }}</span>
              </el-form-item>
              <el-form-item label="申请数量">
                <span>{{ props.row.applyNumber || '-' }}</span>
              </el-form-item>
              <el-form-item label="授权日期">
                <span>{{ props.row.date || '-' }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ props.row.status || '-' }}</span>
              </el-form-item>
              <el-form-item label="安装识别码">
                <span>{{ props.row.seriNumber || '-' }}</span>
              </el-form-item>
              <el-form-item label="授权激活码" class="ellipsis-box">
                <div @mouseenter="($event) => handleCellMouseEnter($event)" @mouseleave="tooltiphidden = true">
                <el-tooltip ref="tootip" :disabled="tooltiphidden" class="item" effect="dark" content="下载查看全部" placement="top">
                  <div class="ellipsis" ref="ellipsis">{{ props.row.authorizationcode || '-' }}</div>
                </el-tooltip>
                </div>
                <!--<ellipseTooltip :row="props"/>-->
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="contractNumber" label="合同编号" show-overflow-tooltip :formatter="formatCellHandler"></el-table-column>
        <el-table-column prop="name" label="客户名称" show-overflow-tooltip :formatter="formatCellHandler"></el-table-column>
        <el-table-column filter-placement="bottom" column-key="productSeries" prop="productSeries" label="产品名称"
                         show-overflow-tooltip :filters="filter.product_series"
                         :filter-multiple="false" :formatter="formatCellHandler"></el-table-column>
        <el-table-column filter-placement="bottom" column-key="version" prop="version" label="产品版本"
                         show-overflow-tooltip :filters="filter.product_version"
                         :filter-multiple="false" :formatter="formatCellHandler"></el-table-column>
        <el-table-column filter-placement="bottom" column-key="productModule" prop="productModule" label="产品组件"
                         show-overflow-tooltip :filters="filter.product_model"
                         :filter-multiple="false" :formatter="formatCellHandler"></el-table-column>
        <el-table-column prop="superveneNumber" label="合同数量" show-overflow-tooltip :formatter="formatCellHandler"></el-table-column>
        <el-table-column prop="license" label="许可" show-overflow-tooltip :formatter="formatCellHandler"></el-table-column>
        <el-table-column prop="applyNumber" label="申请数量" show-overflow-tooltip :formatter="formatCellHandler"></el-table-column>
        <el-table-column prop="date" label="授权日期" show-overflow-tooltip :formatter="formatCellHandler"></el-table-column>
        <el-table-column filter-placement="bottom" column-key="status" prop="status" label="状态" show-overflow-tooltip
                         :filters="filter.audit_status" :filter-multiple="false"></el-table-column>
        <el-table-column
          label="操作"
          :width="auditor ? 250 : 150">
          <template slot-scope="scope">
            <el-button v-if="auditor && scope.row.status === '审核中'"
                       size="mini" type="success" @click="showModalHandler('auditModal', scope.row.id)">审核
            </el-button>
            <el-button v-else-if="auditor && scope.row.status !== '审核中'"
                       size="mini" @click="downloadHandler(scope.row.id)">下载
            </el-button>
            <el-button v-if="auditor || scope.row.status === '审核中'" size="mini" type="primary" @click="showModalHandler('editModal', scope.row.id)">编辑
            </el-button>
            <el-button v-if="auditor || scope.row.status === '审核中'" size="mini" type="danger" @click="deleteHandler(scope.row.id)">删除
            </el-button>
            <span v-if="!auditor && scope.row.status !== '审核中'">-</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="tOptions.pageSize" :current-page.sync="tOptions.page"
        layout="prev, pager, next"
        :total="total"
        @current-change="pageChangeHandler">
      </el-pagination>
    </el-main>
    <!-- 新建modal -->
    <addForm ref="addForm" :filter="addFilter" @success="addSuccessHandler"/>
    <!-- 审核modal -->
    <auditModal ref="auditModal" @success="addSuccessHandler"/>
    <!-- 修改密码modal -->
    <updatePwdModal ref="updatePwdModal" :username="username"/>
    <!-- 修改授权modal -->
    <editModal ref="editModal" :filter="addFilter" @success="addSuccessHandler"/>
  </el-container>
</template>
<script>
  import { Logout, dict, authList, authDelete, authDown, authExport } from '../../api/api'
  import addForm from './AddModal.vue'
  import auditModal from './AuditModal.vue'
  import updatePwdModal from './UpdatePwdModal.vue'
  import editModal from './editModal.vue'

  var pageSize = Math.floor((document.documentElement.clientHeight - 280) / 50) > 0 ? Math.floor((document.documentElement.clientHeight - 280) / 50) : 0
  export default {
    data () {
      return {
        table_loading: false,
        loadingFlag: false,
        auditor: localStorage.role.indexOf('admin') !== -1,
        total: 0,
        tOptions: {
          contractNumber: '',
          name: '',
          starDate: '',
          endDate: '',
          productLine: '',
          product: '',
          productSeries: '',
          productModule: '',
          version: '',
          status: '',
          orderName: 'date',
          order: 'desc',
          start: 0,
          pageSize: pageSize,
          page: 1
        },
        oldOptions: {},
        filter: {
          audit_status: [],
          product: [],
          product_line: [],
          product_model: [],
          product_series: [],
          product_version: []
        },
        addFilter: {},
        search: {
          date: '',
          status: '',
          all: ''
        },
        username: localStorage.userName || '',
        data: [],
        tooltiphidden: true
      }
    },
    watch: {
      'tOptions': {
        handler (val) {
          let filterProLine = this.addFilter.product_line.filter(item => {
            return item.value === val.productLine
          })
          this.filter.product = this.addFilter.product.filter(item => {
            return filterProLine[0] ? item.parentId === filterProLine[0].id : true
          }).map(item => {
            return {text: item.value, value: item.value, id: item.id}
          })
          this.filter.product_series = this.addFilter.product_series.filter(item => {
            return filterProLine[0] ? item.parentId === filterProLine[0].id : true
          }).map(item => {
            return {text: item.value, value: item.value, id: item.id}
          })
          if (this.oldOptions.start === val.start && val.page !== 1) {
            val.page = 1
          } else {
            this.getListHandler()
          }
          Object.assign(this.oldOptions, val)
        },
        deep: true
      },
    },
    components: {
      addForm,
      auditModal,
      updatePwdModal,
      editModal
    },
    methods: {
      // 获取列表
      getListHandler (noLoading) {
        if(!noLoading) {
          this.table_loading = true
        }
        authList(this.tOptions).then(res => {
          this.table_loading = false
          this.total = res.count
          this.data = res.dataList
        })
      },
      // 获取过滤条件
      getDictHandler () {
        dict().then(res => {
          this.addFilter = res
          for (var k in res) {
            this.filter[k] = res[k].map(item => { return {text: item.value, value: item.value, id: item.id}})
          }
        })
      },
      // 登出
      logoutHandler () {
        this.$confirm('确认退出吗?', '退出登录', {}).then(() => {
          Logout().then(() => {
            window.localStorage.clear()
            this.$router.push('/login')
          })
        })
      },
      // 显示子组件
      showModalHandler (refName, id) {
        this.$refs[refName].show(id || '')
      },
      // 分页换页
      pageChangeHandler (val) {
        this.tOptions.start = (val - 1) * this.tOptions.pageSize
      },
      // 列表过滤
      filterHandler (filters) {
        for (let k in filters) {
          this.tOptions[k] = filters[k][0]
        }
      },
      // 清空过滤条件
      clearFilterHandler () {
        this.$refs.table.clearFilter()
        this.tOptions = {
          contractNumber: '',
          name: '',
          starDate: '',
          endDate: '',
          productLine: '',
          product: '',
          productSeries: '',
          productModule: '',
          version: '',
          status: '',
          orderName: 'date',
          order: 'desc',
          start: 0,
          pageSize: pageSize,
          page: 1
        }
      },
      // 组件操作成功回调
      addSuccessHandler (noLoading) {
        this.getListHandler(noLoading)
      },
      // 删除
      deleteHandler (id) {
        this.$confirm('确认删除授权吗?', '删除授权', {}).then(() => {
          authDelete({id: id}).then(res => {
            this.$message.success('删除授权成功')
            this.getListHandler()
          })
        })
      },
      // 下载
      downloadHandler (id) {
        window.location = authDown(id)
        window.URL.revokeObjectURL(authDown(id))
      },
      // 列表下载
      tableDownHandler () {
        authExport(this.tOptions)
      },
      // 判断是否text-overflow, 如果是就显示tooltip
      handleCellMouseEnter (event, row) {
        const Child = event.target.querySelector('.ellipsis')
        if (Child.scrollHeight > Child.offsetHeight) {
          this.tooltiphidden = false
        }
      },
      formatCellHandler (row, column, cellValue) {
        return cellValue || '-'
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getListHandler()
        this.getDictHandler()
        Object.assign(this.oldOptions, this.tOptions)
      })
    }
  }
</script>
<style scoped>
  .el-header { background: #343a40; color: #fff; line-height: 60px; }

  .header-logo { width: 40px; vertical-align: middle; margin-right: 10px; }

  .header-btn { cursor: pointer; padding: 2px 10px; border-left: 2px solid #a1a0a0; }

  .el-table { border: 1px solid #ebeef5; border-bottom: 0; margin-top: 20px; }

  .el-table .warning-row { background: oldlace; }

  .el-main .el-row--flex.is-justify-space-between { padding: 10px; }

  .el-form-item { margin-bottom: 0; }

  .el-pagination { text-align: right; padding: 10px 0; border: 1px solid #ebeef5; border-top: 0; }

  .line { position: relative; right: -5px; }

  .demo-table-expand { font-size: 0; }

  .demo-table-expand .el-form-item { margin-right: 0; margin-bottom: 0; width: 50%; }

  .ellipsis { width: 100%; word-break: break-all; overflow: hidden; box-sizing: border-box; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }

</style>
<style>
  .el-table__body-wrapper { overflow-y: hidden; }

  .demo-table-expand label { width: 100px; color: #99a9bf; }

  .el-dialog__body { padding: 15px 20px 0; }

  .ellipsis-box .el-form-item__content { width: calc(100% - 100px); }

</style>
