const axios = require('axios')
const env = require('../config/env.js').env
const __axios = axios.create({
  baseURL: 'https://api2.91duobaoyu.com/',
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json',
    'X-Ca-Stage': env
  }
})
__axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return (response.data.success || response.data.succ || response.data.dbymsg === 'ok')
    ? response
    : Promise.reject(response)
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
module.exports = __axios
