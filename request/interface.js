const axios = require('./axios')
/**
 *
 * 递归获取播放视频全部数据
 * @param {*} [params={}]
 * @param {*} [success=() => { }]
 * @param {*} [fail=() => { }]
 */
const getInfoByBelongId = function (params = {}, success = () => { }, fail = () => { }) {
  const {
    belongId,
    pageSize = 10
  } = params
  let currentPage = params.currentPage || 1
  let list = params.list || []
  axios({
    method: 'POST',
    url: '/managergateway/filecenter/orderRecall/outer/ignore/getInfoByBelongId.do',
    data: {
      belongId,
      currentPage,
      pageSize
    }
  }).then(async (result) => {
    params.list = [...list, ...result.data.data.list]
    const total = result.data.data.total
    if (currentPage * pageSize < total) {
      params.currentPage = currentPage + 1
      getInfoByBelongId(params, success, fail)
    } else {
      let list = params.list
      list = list.map(item => {
        try {
          return JSON.parse(item.domJson)
        } catch (error) {
          return null
        }
      }).filter(item => !!item)
      try {
        await success(list)
      } catch (e) {
        await fail(e)
      }
    }
  }).catch((err) => {
    fail(err)
  })
}
module.exports.getInfoByBelongId = getInfoByBelongId
/**
 *
 * 获取当前所有未处理的视频id 目前后台设定调用接口后的所有视频为处理中
 * @returns
 */
module.exports.findbelongIds = function () {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/customergateway/filecenter/orderRecall/outer/ignore/findUnFinishedBelongIds.do'
    }).then((result) => {
      resolve(result.data.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
/**
 *
 * 获取oss配置
 * @returns
 */
module.exports.getOssConfig = function () {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/systembiz/stsAuth/getByPolicy.do?policy=1',
      data: {
        policy: 1
      }
    }).then((result) => {
      resolve(result.data.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
/**
 *
 * 设置该视频以及处理出错
 * @param {*} id
 * @returns
 */
module.exports.updateFailBelongIds = function (ids) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '/customergateway/filecenter/orderRecall/outer/ignore/updateFailBelongIds.do',
      data: ids
    }).then((result) => {
      resolve(result.data.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
/**
 *
 * 保存视频地址
 * @param {*} belongId
 * @param {*} videoUrl
 * @returns
 */
module.exports.saveVideoUrl = function (belongId, videoUrl) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '/customergateway/filecenter/orderRecall/outer/ignore/saveVideoUrl.do',
      data: {
        belongId,
        videoUrl
      }
    }).then((result) => {
      resolve(result.data.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
/**
 *
 * 设置该视频在处理中
 * @param {*} id
 * @returns
 */
module.exports.updateStartBelongIds = function (ids) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '/customergateway/filecenter/orderRecall/outer/ignore/updateStartBelongIds.do',
      data: ids
    }).then((result) => {
      resolve(result.data.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports.updateRestoreBelongIds = function (ids) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '/customergateway/filecenter/orderRecall/outer/ignore/updateRestoreBelongIds.do',
      data: ids
    }).then((result) => {
      resolve(result.data.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
module.exports.findDomJsonByBelongId = function (belongId) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '/customergateway/filecenter/orderRecall/outer/ignore/findDomJsonByBelongId.do?belongId=' + belongId,
      data: {
        belongId
      }
    }).then((result) => {
      resolve(result.data.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
