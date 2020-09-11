const {
  getHost
} = require('./env')
module.exports = {
  url: getHost() + '/test/h5_new_media/rrwebPlay/#/play', // 爬取地址
  headless: true, // 是否在执行时候关闭浏览器
  viewport: { // 默认视图大小
    width: 1920,
    height: 1020
  },
  selector: '.replayer-wrapper',     // 爬取范围节点
  left: 0, // 截图左部范围
  top: 0, // 截图顶部范围
  right: 0, // 截图距右范围
  bottom: 0, // 截图底部范围
  fps: 10, // 视频截图频率
  fileType: '.mp4',  // to video.mp4 of the current working directory
  outputFilePath: './videos', // 设置视频存放位置
  startDelay: 0, // 进入页面延迟执行
  threadNumber: 10, // 异步处理线程会影响最大同时处理视频数量
  videoStartTime: 200, // 视频开始时间戳
  autoDeleteVideo: true, // 是否自动删除本地视频源文件
  regularTime: 20 // 定时任务时间单位/分
}
