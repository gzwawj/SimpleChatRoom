const redis = require('redis')

const connection = redis.createClient({
    host: '127.0.0.1',
    port: '6379'
})
const user = 'user'
class RedisModel {
    /**
     * 用户列表
     * 详情添加参数：withscores
     */
    userList() {
        return new Promise((resolve, reject) => {
            connection.zrange(user, 0, -1, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    /**
     * 更新用户数据--有序集合
     * @param {string} data 用户表
     * @param {boolean} status 是否在线
     */
    userUpdata(data, status = true) {
        return new Promise((resolve, reject) => {
            let _time = new Date()
            if (status) {
                //添加或更新
                connection.zadd(user, _time.getTime(), data, (err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
            } else {
                connection.zincrby(user, -86400000, data, (err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
            }
        })
    }
    /**
     * 更新用户信息数据--哈希表
     * @param {string} key 哈希表名
     * @param {string} field 字段
     */
    userInfo(key, field) {
        return new Promise((resolve, reject) => {
            connection.hmget(key, field, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    /**
     * 更新用户信息数据--哈希表
     * @param {string} key 哈希表名
     * @param {string} data 键值对字符串
     */
    userInfoUpdata(key, data) {
        return new Promise((resolve, reject) => {
            connection.hmset(key, data, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    /**
     * 获取聊天消息--列表
     * @param {string} key 列表名
     */
    messageList(key) {
        return new Promise((resolve, reject) => {
            connection.lrange(key, 0, -1, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    /**
     * 添加聊天消息--列表
     * @param {string} key 列表名
     * @param {string} data 消息内容
     */
    messageAdd(key, data) {
        return new Promise((resolve, reject) => {
            connection.lpush(key, data, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
}

let redisModel = new RedisModel()

module.exports = { redisModel }