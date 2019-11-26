const express = require('express')
const utils = require('utility')

const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')
const _filter = {'pwd': 0, '__v': 0}

Router.get('/list', function (req, res) {
  // 路由拼接问号传参使用query获取，json传参通过body获取
  const {type} = req.query
  User.find({type}, function (err, doc) {
    return res.json({code: 0, data: doc})
  })
})

Router.get('/getmsglist', function (req, res) {
  const {userid} = req.signedCookies

  User.find({}, function (e, userdoc) {
    let users = {}
    userdoc.forEach(v => {
      users[v._id] = {name: v.user, avatar: v.avatar}
    })

    Chat.find({'$or': [{from: userid}, {to: userid}]}, function (err, doc) {
      if (!err) {
        return res.json({code: 0, msgs: doc, users: users})
      }
    })
  })
})

Router.post('/update', function (req, res) {
  const {userid} = req.signedCookies
  if (!userid) {
    return res.json({code: 1})
  }
  const body = req.body
  User.findByIdAndUpdate(userid, body, function (err, doc) {
    const data = Object.assign({}, {
      user: doc.user,
      type: doc.type
    }, body)
    return res.json({code: 0, data})
  })
})

Router.post('/login', function (req, res) {
  const {user, pwd} = req.body
  User.findOne({user, pwd: md5Pwd(pwd)}, _filter, function (err, doc) {
    if (!doc) {
      return res.json({code: 1, msg: '用户名或者密码错误'})
    }
    res.cookie('userid', doc._id, {signed: true, maxAge: 60 * 60 * 1000})
    return res.json({code: 0, data: doc})
  })
})

Router.post('/register', function (req, res) {
  console.log(req.body)
  const {user, pwd, type} = req.body
  User.findOne({user}, function (err, doc) {
    if (doc) {
      return res.json({code: 1, msg: '用户名重复'})
    }
    const userModel = new User({user, type, pwd: md5Pwd(pwd)})
    userModel.save(function (e, d) {
      if (e) {
        return res.json({code: 1, msg: '后端出错了'})
      }
      const {user, type, _id} = d
      res.cookie('userid', _id, {signed: true, maxAge: 60 * 60 * 1000})
      return res.json({code: 0, data: {user, type, _id}})
    })
  })
})

Router.get('/info', function (req, res) {
  const {userid} = req.signedCookies
  if (!userid) {
    return res.json({code: 1})
  }
  User.findOne({_id: userid}, _filter, function (err, doc) {
    if (err) {
      return res.json({code: 1, msg: '后端出错了'})
    }
    if (doc) {
      return res.json({code: 0, data: doc})
    }
  })
})

// 引入utility，使用md5加密算法，为防止密码过于简单被暴力破解，我们再进行加密
function md5Pwd(pwd) {
  const salt = 'wzd_chat_app_15521063830_WZD_@~~@'
  return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router
