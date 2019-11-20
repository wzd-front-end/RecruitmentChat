const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', function(socket) {
    console.log('user login')
    // 注意这里使用socket,表示当前连接的请求，io是全局二点请求
    socket.on('sendmsg', function(data) {
        console.log(data)
    })
})

const userRouter = require('./user')

//用于解析cookie
app.use(cookieParser('wzd3830'))
//用于解析body中所传数据
app.use(bodyParser.json())
app.use('/user', userRouter)

server.listen(9093, function(){
    console.log('Node app start at port 9093')
})
