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
import staticPath from '../build/asset-manifest.json'


const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const model = require('./model')
const Chat = model.getModel('chat')

io.on('connection', function (socket) {

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


  let scriptStr = ''
  let linkStr = ''
  staticPath['entrypoints'].forEach(point => {
    if (/.css$/ig.test(point)) {
      linkStr += `<link  rel="stylesheet" href="/${point}">`
    } else if (/.js$/ig.test(point)) {
      scriptStr += `<script src="/${point}"></script>`
    }
  });

  const pageHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="Web site created using create-react-app"/>
      <title>咨询聊天</title>
      <link rel="shortcut icon" href="/favicon.ico">
      ${linkStr}
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">${markup}</div>
      <script>!function (f) { function e(e) { for (var r, t, n = e[0], o = e[1], u = e[2], i = 0, l = []; i < n.length; i++)t = n[i], Object.prototype.hasOwnProperty.call(c, t) && c[t] && l.push(c[t][0]), c[t] = 0; for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (f[r] = o[r]); for (s && s(e); l.length;)l.shift()(); return p.push.apply(p, u || []), a() } function a() { for (var e, r = 0; r < p.length; r++) { for (var t = p[r], n = !0, o = 1; o < t.length; o++) { var u = t[o]; 0 !== c[u] && (n = !1) } n && (p.splice(r--, 1), e = i(i.s = t[0])) } return e } var t = {}, c = { 1: 0 }, p = []; function i(e) { if (t[e]) return t[e].exports; var r = t[e] = { i: e, l: !1, exports: {} }; return f[e].call(r.exports, r, r.exports, i), r.l = !0, r.exports } i.m = f, i.c = t, i.d = function (e, r, t) { i.o(e, r) || Object.defineProperty(e, r, { enumerable: !0, get: t }) }, i.r = function (e) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) }, i.t = function (r, e) { if (1 & e && (r = i(r)), 8 & e) return r; if (4 & e && "object" == typeof r && r && r.__esModule) return r; var t = Object.create(null); if (i.r(t), Object.defineProperty(t, "default", { enumerable: !0, value: r }), 2 & e && "string" != typeof r) for (var n in r) i.d(t, n, function (e) { return r[e] }.bind(null, n)); return t }, i.n = function (e) { var r = e && e.__esModule ? function () { return e.default } : function () { return e }; return i.d(r, "a", r), r }, i.o = function (e, r) { return Object.prototype.hasOwnProperty.call(e, r) }, i.p = "/"; var r = this.webpackJsonprecruitment = this.webpackJsonprecruitment || [], n = r.push.bind(r); r.push = e, r = r.slice(); for (var o = 0; o < r.length; o++)e(r[o]); var s = n; a() }([])</script>    
     ${scriptStr}
    </body>
  </html>`
  res.send(pageHtml)
  // return res.sendFile(path.resolve('build/index.html'))
})
app.use('/', express.static(path.resolve('build')))

server.listen(9093, function () {
  console.log('Node app start at port 9093')
})

