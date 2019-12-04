import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";

import Login from './container/login/login'
import Register from './container/register/register'
import BossInfo from './container/bossinfo/bossinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import DashBoard from './component/dashboard/dashboard'
import Chat from './component/chat/chat'
import AuthRoute from './component/authroute/authroute'
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
      <div>
        <AuthRoute></AuthRoute>
        <Switch>
          <Route path='/bossinfo' component={BossInfo}></Route>
          <Route path='/geniusinfo' component={GeniusInfo}></Route>
          <Route path='/login' component={Login}></Route>
          <Route path='/register' component={Register}></Route>
          <Route path='/chat/:user' component={Chat}></Route>
          <Route component={DashBoard}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>),
  document.getElementById('root'));


