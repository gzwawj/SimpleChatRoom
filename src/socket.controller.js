const redisModel = require('./redis.model').redisModel

function socketchat(io) {
    // redisModel.messageAdd()
    let userid = 0
    let key = ''
    io.on('connection', function (socket) {

        socket.broadcast.emit('login', {
            userid: socket.id
        })
        socket.on('login', (e) => {
            key = e.username
            let data = {
                username: e.username,
                userpic: e.userpic,
                socketid: e.userpic,
                status: true
            }
            //更新用户信息
            redisModel.userInfoUpdata(key, data).then(res => {
                console.log(res)
            })
            //更新用户状态
            redisModel.userUpdata(key, true).then(res => {
                console.log(res)
            })
            //获取用户列表
            redisModel.userList().then(res => {
                let userlist = {}
                for (let i in res) {
                    redisModel.userInfo(res[i], ['username', 'userpic', 'socketid', 'status']).then(res1 => {
                        userlist.push(res1)
                    })
                }
                setTimeout(() => {
                    console.log(userlist)
                }, 200)
            })
        })
        // socket.emit('login', {
        //     userid: socket.id
        // })

        socket.on('disconnect', function () {

            console.log('user disconnected');
            console.log(key)
            // e.status=false

            redisModel.userInfoUpdata(key, { status: false }).then(res => {
                console.log(res)
            })
            redisModel.userUpdata(key, false).then(res => {
                console.log(res)
            })
        });

        socket.on('sendmsg', (e) => {
            console.log(e.socketid, e.msg)
            socket.to(e.socketid).emit('message', e.msg)
        })
    });
}

module.exports = {
    socketchat
}