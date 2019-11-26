import React from 'react'
import io from 'socket.io-client'
import {List, InputItem, NavBar, Icon} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg, getMsgList, recvMsg} from '../../redux/chat.redux.js'
import {getChatId} from '../../unit'

const socket = io('ws://localhost:9093')

@connect(
  state => state,
  {
    sendMsg,
    getMsgList,
    recvMsg
  }
)
class Chat extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      text: '',
      msg: []
    }
  }

  componentDidMount() {
    // 加多此处判断是为了防止多次绑定和获取数据，且在此处需要做这一步是因为除了外面需要获取未读数外，里面也需要获取初始值
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }

  handleSubmit() {
    // socket.emit('sendmsg', { text: this.state.text })
    // this.setState({ text: '' })
    const from = this.props.user._id
    const to = this.props.match.params.user
    const msg = this.state.text
    this.props.sendMsg({from, to, msg})
    this.setState({text: ''})
  }

  render() {
    const userid = this.props.match.params.user
    const Item = List.Item
    const users = this.props.chat.users
    if (!users[userid]) {
      return null
    }
    const chatid = getChatId(userid, this.props.user._id)
    const chatmsgs = this.props.chat.chatmsg.filter(v => v.chatid === chatid)

    return (
      <div id='chat-page'>
        <NavBar
          mode='dark'
          icon={<Icon type='left'/>}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
        >
          {users[userid].name}
        </NavBar>

        {chatmsgs.map(v => {

          return v.from === userid ? (
            <List key={v._id}>
              <Item
                thumb={require(`../img/${users[v.from].avatar}.jpeg`)}
              >{v.content}</Item>
            </List>
          ) : (
            <List key={v._id}>
              <Item
                extra={<img src={require(`../img/${users[v.from].avatar}.jpeg`)}/>}
                className='chat-me'
              >{v.content}</Item>
            </List>
          )
        })}
        <div className='stick-footer'>
          <List>
            <InputItem
              placeholder='请输入'
              value={this.state.text}
              onChange={v => {
                this.setState({text: v})
              }}
              extra={<span onClick={() => this.handleSubmit()}>发送</span>}
            ></InputItem>
          </List>
        </div>
      </div>
    )
  }
}

export default Chat
