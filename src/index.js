import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {BrowserRouter} from "react-router-dom"
import App from './app'
import reducers from './reducer'

import './config'
import './index.css'

//第二个参数是设置用于配置chrome调试工具使用Redux Devtools
const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

//这里有个自动跳转得组件，是该课程设计的知识点，
//在路由组件执行前先进行一个身份登陆得检查，即能够达到检查，又在同时放于路由相关模块，便于查看，跟重定向Redirect有异曲同工之妙
ReactDOM.render(
  (<Provider store={store}>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  </Provider>),
  document.getElementById('root'));


