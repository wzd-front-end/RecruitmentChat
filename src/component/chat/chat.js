import React from 'react'
import {List, InputItem, NavBar, Icon, Grid} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg, getMsgList, recvMsg, changeScroll, readMsg} from '../../redux/chat.redux.js'
import {getChatId} from '../../unit'
import QueueAnim from 'rc-queue-anim'

@connect(
  state => state,
  {
    sendMsg,
    getMsgList,
    recvMsg,
    changeScroll,
    readMsg
  }
)
class Chat extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      text: '',
      showEmoji: false
    }
  }

  componentDidMount() {
    // 加多此处判断是为了防止多次绑定和获取数据，且在此处需要做这一步是因为除了外面需要获取未读数外，里面也需要获取初始值
    this.props.changeScroll(1)
    this.focusInput()
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }

  componentWillUnmount() {
    this.props.readMsg(this.props.match.params.user)
  }

  fixCarousel() {
    // 解决Grid组件存在的初始化问题
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 0)
  }

  handleSubmit() {
    const from = this.props.user._id
    const to = this.props.match.params.user
    const msg = this.state.text
    this.props.sendMsg({from, to, msg})
    this.setState({text: ''})
  }

  // 解决进入聊天界面没有自动滚动到底部的问题
  focusInput = () => {
    setTimeout(function () {
      window.scrollTo(0, document.documentElement.scrollHeight)
    }, 100)
  }

  render() {
    const emoji = '😀 😃 😄 😁 😁 😁 🤣 😂 😃 😃 😉 😊 😇 😍 🤩 😘 😗 ☺ 😚 😙 😋 😋 😜 🤪 😝 🤑 🤗 🤭 🤫 🤫 🤨 🤐 😐 😑'
      .split(' ')
      .filter(v => v)
      .map(v => ({text: v}))

    const userid = this.props.match.params.user
    const users = this.props.chat.users
    if (!users[userid]) {
      return null
    }
    const chatid = getChatId(userid, this.props.user._id)
    const chatmsgs = this.props.chat.chatmsg.filter(v => v.chatid === chatid)

    return (
      <div id='chat-page'>
        <div className='nav-block'>
          <NavBar
            mode='dark'
            icon={<Icon type='left'/>}
            onLeftClick={() => {
              this.props.history.goBack()
            }}
          >
            {users[userid].name}
          </NavBar>
        </div>
        <section className='chat-block'>
          {chatmsgs.map(v => {
            return v.from === userid ? (
              <QueueAnim interval={0} type='left' key={v._id}>
                <div className='chat-message' key={v._id}>
                  <div className='avatar-block'>
                    <img className='avatar-img' alt='头像' src={require(`../img/${users[v.from].avatar}.jpeg`)}/>
                  </div>
                  <div className='message-content bubble-left'>
                    <div className='bubble-block'>{v.content}</div>
                  </div>
                  <div className='avatar-block'></div>
                </div>
              </QueueAnim>
            ) : (
              <QueueAnim interval={0} type='right' key={v._id}>
                <div className='chat-message' key={v._id}>
                  <div className='avatar-block'></div>
                  <div className='message-content bubble-right'>
                    <div className='bubble-block'>{v.content}</div>
                  </div>
                  <div className='avatar-block'>
                    <img className='avatar-img' alt='头像' src={require(`../img/${users[v.from].avatar}.jpeg`)}/>
                  </div>
                </div>
              </QueueAnim>
            )
          })}
        </section>
        <div className='stick-footer'>
          <List>
            <InputItem
              placeholder='请输入'
              value={this.state.text}
              onChange={v => {
                this.setState({text: v})
              }}
              onFocus={this.focusInput}
              onBlur={this.focusInput}
              extra={
                <div>
                  <span
                    role='img'
                    style={{marginRight: 15}}
                    onClick={() => {
                      this.setState({showEmoji: !this.state.showEmoji})
                      this.fixCarousel()
                    }}
                  >😀</span>
                  <span
                    onClick={() => {
                      this.handleSubmit()
                      this.setState({showEmoji: false})
                    }}
                  >发送</span>
                </div>
              }
            ></InputItem>
          </List>
          {this.state.showEmoji
            ? <Grid
              data={emoji}
              columnNum={8}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={el => {
                this.setState({
                  text: this.state.text + el.text
                })
              }}
            /> : null
          }
        </div>
      </div>
    )
  }
}

export default Chat
