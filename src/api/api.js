/**
 * 接口
 * @author guoxiaoning@easted.com.cn (guoxn)
 */
import axios from 'axios'
import qs from 'qs'
import router from '../router'
import {Message} from 'element-ui'

let base = '/webadmin'
// base = '/dev'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// http request 拦截器
axios.interceptors.request.use(config => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data, {arrayFormat: 'brackets'})
  }
  return config
})
// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === '200') {
      return response.data.data
    } else if (response.config.responseType === 'blob') {
      return response
    } else {
      Message.error(response.data.msg)
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 跳转到登录页面
          router.push({
            path: '/login'
          })
          break
        case 500:
          router.push({
            path: '/error/500'
          })
          break
        case 404:
          router.push({
            path: '/error/404'
          })
          break
        case 504:
          router.push({
            path: '/error/504'
          })
          break
      }
    }
    return Promise.reject(error.response.data)
  }
)

// 登陆
export const Login = params => {
  return axios.post(`${base}/login`, params)
}

// 登出
export const Logout = params => {
  return axios.get(`${base}/logout`)
}

// 修改密码
export const modifyPwd = params => {
  return axios.get(`${base}/user/updatePwd`, {params: params})
}

// 字典
export const dict = params => {
  return axios.get(`${base}/dict/getalldict`)
}

// 授权列表
export const authList = params => {
  return axios.post(`${base}/auth/list`, params)
}

// 申请授权
export const authAdd = params => {
  return axios.post(`${base}/auth/add`, params)
}

// 删除授权
export const authDelete = params => {
  return axios.delete(`${base}/auth/delete`, {params: params})
}

// 授权准备
export const willAudit = params => {
  return axios.get(`${base}/auth/update`, {params: params})
}

// 获取授权激活码
export const getAuthCode = _ => {
  return axios.post(`${base}/auth/getAuthCode`)
}

// 授权
export const didAudit = params => {
  return axios.post(`${base}/auth/update`, params)
}

// 授权下载
export const authDown = params => {
  return `${base}/auth/${params}/txt`
}

// 列表下载
export const authExport = params => {
  return axios.post(`${base}/auth/export`, params, {
    responseType: 'blob'
  }).then(res => {
    console.log(res)
    if (res.data) {
      let blob = res.data
      let a = document.createElement('a')
      let url = window.URL.createObjectURL(blob)
      let filename = decodeURI(res.headers['content-disposition'].split('=')[1].split('.')[0])
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    }
  })
}
