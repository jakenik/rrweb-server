module.exports.getTime = function (mode) {
    const fn = (v) => {
        v = v < 10
            ? '0' + v
            : v.toString()
        return v
    }
    let date = new Date()
    let year = fn(date.getFullYear())
    let month = fn(date.getMonth() + 1)
    let day = fn(date.getDate())
    let h = fn(date.getHours())
    let m = fn(date.getMinutes())
    let s = fn(date.getSeconds())
    switch (mode) {
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`
        case 'YYYY-MM-DD HH:mm:ss':
            return `${year}-${month}-${day} ${h}:${m}:${s}`
        case 'time':
            return {
                year, month, day, h, m, s
            }
        default:
            break
    }
}

module.exports.awaitFor = async function (array, cb) { // 使用等待的循环
    let i = 0
    let handle = async (array, cb) => {
        if(i === array.length){
            return true
        } else {
            await cb(array[i] ,i)
            i ++
            await handle(array, cb)
        }
    }
    return await handle(array, cb).catch((err) => {
        return Promise.reject({err, index: i, list: array.slice(i, array.length - 1), item: array[i]})
    })
}
