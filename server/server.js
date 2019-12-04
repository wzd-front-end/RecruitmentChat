const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const model = require('./model')
const Chat = model.getModel('chat')

io.on('connection', function (socket) {
  console.log('user login')
  // 注意这里使用socket,表示当前连接的请求，io是全局二点请求
  socket.on('sendmsg', function (data) {
    const {from, to, msg} = data
    const chatid = [from, to].sort().join('_')
    Chat.create({chatid, from, to, content: msg, create_time: new Date().getTime()}, function (err, doc) {
      io.emit('recvmsg', Object.assign({}, doc._doc))
    })
  })
})

const userRouter = require('./user')

//用于解析cookie
app.use(cookieParser('wzd3830'))
//用于解析body中所传数据
app.use(bodyParser.json())
app.use('/user', userRouter)
app.use(function (req, res, next) {
  if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
    return next()
  }
  return res.sendFile(path.resolve('../build/index.html'))
})
app.use('/', express.static(path.resolve('../build')))

server.listen(9093, function () {
  console.log('Node app start at port 9093')
})
