const redisModel = require('./redis.model').redisModel

function socketchat(io, sessionid) {
    io.on('connection', function (socket) {
        //用户登录
        socket.on('login', (e) => {
            let data = {
                username: e.username,
                userpic: e.userpic,
                socketid: e.socketid,
                sessionid: sessionid,
                status: true
            }
            // console.log(data)
            //更新用户信息
            redisModel.userInfoUpdata(sessionid, data).then(res => {
                // console.log("userInfoUpdata")
            })
        })
        //更新用户状态
        redisModel.userUpdata(sessionid, true).then(res => {
            // console.log("userUpdata")
        })
        userlistdata(socket)
        //获取用户之间的聊天内容
        socket.on('useritem', (e) => {
            let key = e.to + "@" + e.from
            messagelistdata(socket, key, e.socketid)
        })
        //退出登录或刷新页面
        socket.on('disconnect', function () {
            redisModel.userInfoUpdata(sessionid, { status: false }).then(res => {
                userlistdata(socket)
            })
            redisModel.userUpdata(sessionid, false).then(res => {
                userlistdata(socket)
            })
        });
        //发送消息
        socket.on('sendmsg', (e) => {
            let key = e.to + "@" + e.from
            let _time = new Date()
            let data = {
                to: e.to,
                from: e.from,
                msg: e.msg,
                times: _time.getTime()
            }
            if (e.msg) {
                redisModel.userInfo('messagetable', key).then(res_message => {
                    redisModel.messageAdd(res_message[0], JSON.stringify(data)).then(res => {
                        if (res) {
                            messagelistdata(socket, res_message[0], e.socketid)
                        }
                    })
                })
            }
        })
    });
    /**
     * 用户列表数据
     * @param {*} socket 
     */
    function userlistdata(socket) {
        //获取用户列表
        getUserInfoList().then(data => {
            socket.broadcast.emit('userlist', data)
        })
    }
    /**
     * 用户之间聊天数据
     * @param {*} socket 
     * @param {*} key 表名
     */
    function messagelistdata(socket, key, socketid) {
        redisModel.messageList(key).then(
            res => {
                let messagelist = []
                let timearr = []
                for (let i in res) {
                    let obj = JSON.parse(res[i])
                    if (timearr.indexOf(obj.times) < 0) {
                        messagelist.unshift({
                            to: obj.to,
                            from: obj.from,
                            msg: obj.msg,
                            times: obj.times
                        })
                        timearr.push(obj.times)
                    }
                }
                socket.to(socketid).emit('message', messagelist)
            }
        )
    }
}
async function getUserInfoList(sessionid) {
    return new Promise((resolve, reject) => {
        redisModel.userList().then(res => {
            let userlist = []
            let socketidarr = []
            for (let i in res) {
                redisModel.userInfo(res[i], ['username', 'userpic', 'socketid', 'sessionid', 'status']).then(res1 => {
                    if (socketidarr.indexOf(res1[2]) < 0 && res1[3] != sessionid && res1[2]) {
                        userlist.unshift({
                            username: res1[0],
                            userpic: res1[1],
                            socketid: res1[2],
                            status: res1[4]
                        })
                        socketidarr.push(res1[2])
                    }
                }, err1 => {
                    reject(err1)
                })
            }
            setTimeout(() => {
                resolve(userlist)
            }, 200)
        }, err => {
            reject(err)
        })
    })
}

module.exports = {
    socketchat,
    getUserInfoList
}