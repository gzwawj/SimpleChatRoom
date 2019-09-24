const redisModel = require('./redis.model').redisModel

function socketchat(io, sessionid) {
    io.on('connection', function (socket) {
        // socket.broadcast.emit('login', {
        //     userid: socket.id
        // })
        socket.on('login', (e) => {
            let data = {
                username: e.username,
                userpic: e.userpic,
                socketid: e.socketid,
                sessionid: sessionid,
                status: true
            }
            //更新用户信息
            redisModel.userInfoUpdata(sessionid, data).then(res => {
                console.log(res)
            })
            //更新用户状态
            redisModel.userUpdata(sessionid, true).then(res => {
                console.log(res)
            })
            //获取用户列表
            redisModel.userList().then(res => {
                let userlist = []
                for (let i in res) {
                    redisModel.userInfo(res[i], ['username', 'userpic', 'socketid', 'status']).then(res1 => {
                        userlist.push(res1)
                    })
                }
                setTimeout(() => {
                    socket.emit('userlist',userlist)
                }, 200)
            })
        })
        socket.on('useritem',(e)=>{
            let key = e.to+"@"+e.from
            redisModel.messageList(encodeURIComponent(key)).then(
                res=>{
                    //内容与转码
                    console.log(decodeURIComponent(res))
                }
            )
        })

        socket.on('disconnect', function () {
            console.log('user disconnected')
            redisModel.userInfoUpdata(sessionid, { status: false }).then(res => {
                console.log(res)
            })
            redisModel.userUpdata(sessionid, false).then(res => {
                console.log(res)
            })
        });

        socket.on('sendmsg', (e) => {
            let key = e.to+"@"+e.from
            socket.to(e.socketid).emit('message', e.msg)
            redisModel.messageAdd(encodeURIComponent(key),e.msg).then(res=>{
                console.log(res)
            })
        })
    });
}

module.exports = {
    socketchat
}