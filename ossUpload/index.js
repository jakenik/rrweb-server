const OSS = require('ali-oss')
const { getOssConfig } = require('../request/interface')
module.exports = async function upload({ name, path }) {
  const config = await getOssConfig()
  this.client = new OSS(config)
  let result = await this.client.put(name, path);
  return result
}
