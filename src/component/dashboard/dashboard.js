import React from 'react'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'
import NavLinkBar from '../navlink/navlink'
import {Redirect, Route} from 'react-router-dom'
import Boss from '../../component/boss/boss'
import Genius from '../../component/genius/genius'
import User from '../../component/user/user'
import Msg from '../../component/msg/msg'
import QueueAnim from 'rc-queue-anim'
import {getMsgList, recvMsg, changeScroll} from '../../redux/chat.redux.js'

@connect(
  state => state,
  {
    getMsgList,
    recvMsg,
    changeScroll
  }
)
class DashBoard extends React.Component {
  componentDidMount() {
    // 加多此处判断是为了防止多次绑定和获取数据
    this.props.changeScroll(0)
    if (this.props.chat.chatmsg.length <= 0) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }

  render() {
    const user = this.props.user
    const {pathname} = this.props.location
    const navList = [
      {
        path: '/boss',
        text: '牛人',
        icon: 'job',
        title: '牛人列表',
        component: Boss,
        hide: user.type === 'genius'
      },
      {
        path: '/genius',
        text: 'boss',
        icon: 'boss',
        title: 'Boss列表',
        component: Genius,
        hide: user.type === 'boss'
      },
      {
        path: '/msg',
        text: '消息',
        icon: 'msg',
        title: '消息列表',
        component: Msg
      },
      {
        path: '/personal',
        text: '我',
        icon: 'user',
        title: '个人中心',
        component: User
      }
    ]
    const title = navList.find(v => v.path === pathname) ? navList.find(v => v.path === pathname).title : ''
    const page = navList.find(v => v.path === pathname)
    console.log(this.props.user)

    return (
      <div>
        <NavBar className='fixd-header' mode='dard'>{title}</NavBar>
        <div style={{marginTop: 45}}>
          <QueueAnim type='alpha' duration={500}>
            {pathname === '/' ?
              (<Route path='/'>
                <Redirect to='/personal'></Redirect>
              </Route>)
              : <Route key={page.path} path={page.path} component={page.component}></Route>
            }
          </QueueAnim>
        </div>
        <NavLinkBar data={navList}></NavLinkBar>
      </div>
    )
  }
}

export default DashBoard
