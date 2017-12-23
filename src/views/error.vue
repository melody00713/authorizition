<template>
  <div class="error">
    <el-col :span="12" :offset="12" class="error-msg">
      <p style="font-size: 80px;color:#95b4cf;">{{$route.params.code}}</p>
      <p v-if="$route.params.code === '404'">额~页面变成蝴蝶飞走了...</p>
      <div v-else-if="$route.params.code.indexOf('5') === 0">
        <p>抱歉，服务器异常</p>
        <p>后台小哥哥正在抓紧抢修中...</p>
      </div>
      <el-button type="primary" @click="toDashboard">返回首页</el-button>
      <el-button @click="toBack">返回上一页</el-button>
    </el-col>
  </div>
</template>
<script>
  export default({
    methods: {
      toDashboard () {
        this.$router.push('/')
      },
      toBack () {
        this.$router.back()
      }
    }
  })
</script>
<style scoped>
  .page-container {
    font-size: 20px;
    text-align: center;
    color: rgb(192, 204, 218);
  }

  .error {
    position: fixed;
    top: 50px;
    left: 50px;
    right: 50px;
    bottom: 50px;
    background: url("../assets/images/error_bg.jpg") no-repeat 0 0;
    background-size: contain;
  }
  .error .error-msg {
    position: absolute;
    top: 50%;
    margin-top: -210px;
    font-size: 38px;
    line-height: 46px;
    color: rgb(192, 204, 218);
  }
</style>
