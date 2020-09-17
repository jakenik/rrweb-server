const path = require('path')
module.exports = {
  apps: [
    {
      // 生产环境
      name: "prod",
      // 项目启动入口文件
      script: path.resolve(__dirname, "../app.js"),
      // 项目环境变量
      env: {
        "NODE_ENV": "prod"
      }
    }, {
      // 测试环境
      name: "test",
      // 项目启动入口文件
      script: path.resolve(__dirname, "../app.js"),
      // 项目环境变量
      env: {
        "NODE_ENV": "test"
      }
    }, {
      // 测试环境
      name: "pre",
      // 项目启动入口文件
      script: path.resolve(__dirname, "../app.js"),
      // 项目环境变量
      env: {
        "NODE_ENV": "pre"
      }
    }
  ]
}
