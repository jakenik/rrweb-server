var env = process.env.NODE_ENV
var keys = {
  development: 'TEST',
  test: "TEST",
  pre: "PRE",
  prod: "RELEASE"
}
module.exports.env = keys[env]

module.exports.getHost = function () {
  var hosts = {
    development: "https://admin.91duobaoyu.com",
    test: "https://admin.91duobaoyu.com",
    pre: "https://pre.91duobaoyu.com",
    prod: "https://www.91duobaoyu.com"
  }
  return hosts[env]
}
