const express = require('express')
const utils = require('utility')

const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')

Router.get('/list', function (req, res) {
  User.find({}, function (err, doc) {
    return res.json(doc)
  })
})
Router.post('/register', function (req, res) {
  console.log(req.body)
  const {user, pwd, type} = req.body
  User.findOne({user}, function (err, doc) {
    if (doc) {
      return res.json({code: 1, msg: '用户名重复'})
    }
    User.create({user, type, pwd: md5Pwd(pwd)}, function (e, d) {
      if (e) {
        return res.json({code: 1, msg: '后端出错了'})
      }
      return res.json({code: 0})
    })
  })
})
Router.get('/info', function (req, res) {
  return res.json({code: 1})
})
// 引入utility，使用md5加密算法，为防止密码过于简单被暴力破解，我们再进行加密
function md5Pwd(pwd) {
  const salt = 'wzd_chat_app_15521063830_WZD_@~~@'
  return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router
