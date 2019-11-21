import React from 'react'
import io from 'socket.io-client'
import { List, InputItem } from 'antd-mobile'
const socket = io('ws://localhost:9093')

class Chat extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      text: ''
    }
  }

  componentDidMount() {

  }

  handleSubmit() {
    socket.emit('sendmsg', {text: this.state.text})
    this.setState({text: ''})
  }

  render() {
    console.log(this.props)
    return (
      <div className='stick-footer'>
        <List>
          <InputItem
            placeholder='请输入'
            value={this.state.text}
            onChange={v => {
              this.setState({ text: v })
            }}
            extra={<span onClick={() => this.handleSubmit()}>发送</span>}
          >信息</InputItem>
        </List>
      </div>
    )
  }
}

export default Chat
