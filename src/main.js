const express = require('express')
const bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let socket = require('./socket.controller')
let redisModel = require('./redis.model').redisModel

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('sessiontest'));
app.use(session({
    secret: 'sessiontest',
    name: 'session_id',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
    },
    rolling: true //强制刷新
}))
// app.use((req, res, next) => {
//     if (!req.session.views) {
//         req.session.views = {}
//     }
//     let pathname = parseurl(req).pathname
//     req.session.views['/'] = (req.session.views[pathname] || 0) + 1

//     next()
// })
let sessionid = ''
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html');
    sessionid = req.sessionID
    res.send()
});
app.post('/islogin', (req, res, next) => {
    if (req.session.user) {
        res.send({ "status": true, "username": req.session.user.username, "userpic": req.session.user.userpic })
    } else {
        res.send({ "status": false })
    }
})
app.post('/login', (req, res, next) => {
    redisModel.userInfo(req.sessionID, ['username', 'userpic', 'sessionid', 'socketid']).then(
        data => {
            let userinfo = {}
            if (data[0]) {
                userinfo = {
                    username: data[0],
                    userpic: data[1]
                }
                req.session.user = userinfo
            } else {
                userinfo = {
                    username: req.body.username,
                    userpic: req.body.userpic
                }
                req.session.user = userinfo
                userinfo['sessionid'] = req.sessionID
            }
            userinfo['status'] = true
            //添加到缓存
            redisModel.userInfoUpdata(req.sessionID, userinfo).then(res_infoupdata => {
                if (res_infoupdata) {
                    redisModel.userUpdata(req.sessionID, true).then(res_updata => {
                        res.send({ "status": true, "username": req.session.user.username, "userpic": req.session.user.userpic })
                    })
                }
            })
        }
    )
})

socket.socketchat(io, sessionid)

http.listen(3000, () => {
    console.log('listening on *:3000');
});
