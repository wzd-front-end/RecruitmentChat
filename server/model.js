const mongoose = require('mongoose')
//在路径后面我们可以添加一个/chat-app去链接对应数据库，如果没有会自动回帮我们创建
const DB_URL = 'mongodb://localhost:27017/chat-app'
mongoose.connect(DB_URL)
mongoose.connection.on('connected',function(){
    console.log('mongo connect success')
})