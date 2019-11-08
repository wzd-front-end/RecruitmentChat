import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, Radio, WingBlank, WhiteSpace, Button} from 'antd-mobile'

class Register extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      type: 'genius'
    }

  }

  onChange(value) {
    this.setState({
      type: value
    })
  }

  render() {
    const RadioItem = Radio.RadioItem
    return (
      <div>
        <Logo></Logo>
        <List>
          <InputItem>用户名</InputItem>
          <InputItem>密码</InputItem>
          <InputItem>确认密码</InputItem>
          <RadioItem checked={this.state.type == 'genius'} onChange={this.onChange.bind(this, 'genius')}>
            牛人
          </RadioItem>
          <RadioItem checked={this.state.type == 'boss'} onChange={this.onChange.bind(this, 'boss')}>
            BOSS
          </RadioItem>
        </List>
        <WhiteSpace/>
        <WingBlank>
          <Button type="primary">注册</Button>
        </WingBlank>
      </div>
    )
  }
}

export default Register
