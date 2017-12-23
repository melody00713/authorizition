<template>
  <div>
    <img src="../assets/images/Login_Bg.png" class="login-bgImg">
    <el-form :model="loginForm" :rules="loginFormRules" ref="loginForm" label-position="left"
             class="login-container" @keyup.enter.native.prevent="loginHandler">
      <p class="login-title">授权管理平台</p>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%">
        <el-button type="danger" style="width:100%;" @click.native.prevent="loginHandler" :loading="logining">登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { Login } from '@/api/api'
  export default {
    data () {
      return {
        logining: false,
        loginForm: {
          username: '',
          password: ''
        },
        loginFormRules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      loginHandler (ev) {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.logining = true
            Login(this.loginForm).then(res => {
              this.logining = false
              if (res !== '已登录') {
                localStorage.userName = res['userName']
                localStorage.role = res['roles']
              }
              this.$router.push({path: '/'})
            }).catch(_ => {
              this.logining = false
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-bgImg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .login-ltImg {
    position: fixed;
    left: 0;
    top: 20px;
  }

  .login-container-img { margin-bottom: 15px; }

  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    width: 350px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -168px;
    margin-left: -175px;
  }

  .login-container .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login-container .remember {
    margin: 0px 0px 35px 0px;
  }

  .login-title {
    font-size: 20px;
    font-style: italic;
    font-weight: bold;
    color: #df2434;
    text-align: center;
  }
</style>
