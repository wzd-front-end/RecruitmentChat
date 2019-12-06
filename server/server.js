import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'

// ssr首屏优化相关依赖
// css需要特殊处理https://github.com/css-modules/css-modules-require-hook
// csshook需要在import app之前引入，才能对钩子函数做出对应处理
import csshook from 'css-modules-require-hook/preset'
import assethook from 'asset-require-hook'

assethook({
  extensions: ['jpg', 'jpeg', 'png']
})

import React from 'react'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {StaticRouter} from "react-router-dom"
import App from '../src/app'
import reducers from '../src/reducer'
import {renderToString} from 'react-dom/server'


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
  const store = createStore(reducers, compose(
    applyMiddleware(thunk)
  ))

  let context = {}
  const markup = renderToString((
    <Provider store={store}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        <App></App>
      </StaticRouter>
    </Provider>
  ))

  const pageHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="Web site created using create-react-app"/>
      <title>咨询聊天</title>
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">${markup}</div>
    </body>
  </html>`

  res.send(pageHtml)
  // return res.sendFile(path.resolve('build/index.html'))
})
app.use('/', express.static(path.resolve('build')))

server.listen(9093, function () {
  console.log('Node app start at port 9093')
})
