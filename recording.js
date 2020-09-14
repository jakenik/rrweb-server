const timecut = require('./timecut');
const path = require('path')
const config = require('./config')
const fs = require('fs')
const { getInfoByBelongId, findbelongIds, updateFailBelongIds, saveVideoUrl } = require('./request/interface')
const { awaitFor } = require('./utils')
const OssUpload = require('./ossUpload')
let __rrwebPlayerFinish = false
let __isRun = false // 当前进程是否正在运行
const getRrwebPlayerFinish = async function (page) { // 添加监听当前网页播放器是否停止
  __rrwebPlayerFinish = await page.evaluate('window.__rrwebPlayerFinish')
}
let queue = [] // 当前执行的任务队列
module.exports = async function () {
  if (!__isRun) {
    queue = []
  }
  await pushQueue()
  if (__isRun) {
    return Promise.resolve() // 进程未结束不在重启
  }
  console.log(__isRun, '当前进程是否运行')
  __isRun = true
  return await awaitFor(queue, async (ids) => {
    console.log(ids, '正在处理的视频')
    return Promise.allSettled(ids.map(id => {
      return recordhandle(id).then((res) => {
        let { localFileSrc, belongId } = res
        return Promise.allSettled([
          config.autoDeleteVideo
            ? new Promise((resolve, reject) => {
              fs.unlink(localFileSrc, (err) => {
                err
                  ? reject(err)
                  : resolve()
              })
            })
            : Promise.resolve(res)
        ]).then(() => {
          delIdQueue(belongId)
          return Promise.resolve(res)
        })
      }).catch((id, err) => {
        updateFailBelongIds([id])
        return Promise.reject(err)
      })
    }))
  }).then(() => {
    __isRun = false
    return Promise.resolve()
  }).catch(({ err, list }) => {
    batchUpdateFailBelongIds(list)
    return Promise.reject(err)
  })
}
// module.exports = async function () {
//   recordhandle(7100041998839808)
// }
/**
 *
 * 视频录制处理
 * @param {*} belongId 视频id
 * @returns Promise
 */
const recordhandle = function (belongId) {
  __rrwebPlayerFinish = false
  return new Promise((resolve, reject) => {
    getInfoByBelongId({
      belongId
    }, (list) => {
      if (!(Array.isArray(list) && list.length > 0)) return
      const videoTime = (list[list.length - 1].timestamp - list[0].timestamp) / 1000
      config.duration = typeof videoTime === 'number' ? videoTime : 60 * 60 * 2 // 获取视频播放长度 如果计算出错给出最大时长
      if (config.outputFilePath && config.fileType) config.output = config.outputFilePath + '/' + belongId + config.fileType
      // console.log(config.duration / 60)
      timecut({
        ...config,
        stopController(page) { // 如果播放器直接结束停止录制
          getRrwebPlayerFinish(page)
          return __rrwebPlayerFinish
        },
        async preparePage(page) { // 写入播放器所需数据，目前数据由node层去请求直接写入播放器网页
          await page.exposeFunction('__rrwebPlayerList', () => list)
          await page.evaluateHandle(() => __newRrwebPlayer())
        },
        async beforeCapture(page, promiseLoop) { // 截图之前执行播放器播放
          await page.evaluateHandle((videoStartTime) => replayer.play(videoStartTime || 200), config.videoStartTime)
          return promiseLoop()
        },
        insertTimes: [300, 500],
        insertList: getInsertList(config)
      }).then(async (localFileSrc) => {
        await OssUpload({
          name: belongId + config.fileType, path: localFileSrc
        }).then((res) => {
          const url = res.url
          saveVideoUrl(belongId, url).then(() => {
            resolve({
              belongId,
              url,
              localFileSrc
            })
          }).catch((err) => {
            reject(belongId, err)
          })
        }).catch((err) => {
          reject(belongId, err)
        })
      }).catch((err) => {
        reject(belongId, err)
      })
    }, (err) => {
      reject(belongId, err)
    })
  })
}

/**
 *
 * 将未处理视频推入任务队列堆栈
 * @returns queue:number[][]
 */
const pushQueue = async function () {
  let belongIds = await findbelongIds()
  if (!(Array.isArray(belongIds) && belongIds.length > 0)) return queue
  const threadNumber = config.threadNumber
  const deep = () => {
    queue.push(belongIds.splice(0, threadNumber))
    if (belongIds.length > 0) {
      deep()
    }
  }
  return deep()
}

/**
 *
 * 删除处理完成或者失败的视频id
 * @param {*} id
 */
const delIdQueue = function (id) {
  for (let i = 0; i < queue.length; i++) {
    let index = queue[i].indexOf(id)
    index !== -1
      ? queue[i].splice(index, 1)
      : false
  }
}
/**
 *
 * 删除处理完成或者失败的视频id
 * @param {*} id
 */
const batchUpdateFailBelongIds = function (list) {
  let rmList = []
  list.forEach((ids) => {
    rmList = [...ids, ...rmList]
  })
  updateFailBelongIds(rmList)
}

const getInsertList = function (config) {
  let list = []
  for (let i = 0; i <= config.insertImgNumber; i++) {
    list.push(config.insertImgSrc)
  }
  return list
}
