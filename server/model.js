const mongoose = require('mongoose')
//在路径后面我们可以添加一个/chat-app去链接对应数据库，如果没有会自动回帮我们创建
const DB_URL = 'mongodb://localhost:27017/chat-app'
mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
)

const models = {
  user: {
    'user': {type: String, require: true},
    'pwd': {type: String, require: true},
    'type': {type: String, require: true},
    // 头像
    'avatar': {type: String},
    // 个人介绍或者职位介绍
    'desc': {type: String},
    // 职位名
    'title': {type: String},
    // 如果是boss，还有两个字段
    'company': {type: String},
    'money': {type: String}
  },
  chat: {}
}
for (let m in models) {
  mongoose.model(m, new mongoose.Schema(models[m]))
}

module.exports = {
  getModel: function (name) {
    return mongoose.model(name)
  }
}
