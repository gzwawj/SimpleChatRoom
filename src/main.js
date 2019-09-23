const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let socket = require('./socket.controller')

app.use(express.static('public'))
app.get('/', function (req, res) {
    // res.sendFile(__dirname + '/index.html');
    res.send()
});

socket.socketchat(io)

http.listen(3000, function () {
    console.log('listening on *:3000');
});
