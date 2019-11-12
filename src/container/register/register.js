import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, Radio, WingBlank, WhiteSpace, Button} from 'antd-mobile'

class Register extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      user: '',
      pwd: '',
      repeatpwd: '',
      type: 'genius'
    }

  }

  handleChange(key, val) {
    this.setState({
      [key]: val
    })
  }

  handleRegister = () => {
    console.log(this.state)
  }

  render() {
    const RadioItem = Radio.RadioItem
    return (
      <div>
        <Logo></Logo>
        <List>
          <InputItem onChange={v => this.handleChange('user', v)}>用户名</InputItem>
          <InputItem onChange={v => this.handleChange('pwd', v)} type='password'>密码</InputItem>
          <InputItem onChange={v => this.handleChange('repeatpwd', v)} type='password'> 确认密码</InputItem>
          <RadioItem checked={this.state.type === 'genius'} onChange={v => this.handleChange('type', 'genius')}>
            牛人
          </RadioItem>
          <RadioItem checked={this.state.type === 'boss'} onChange={v => this.handleChange('type', 'boss')}>
            BOSS
          </RadioItem>
        </List>
        <WhiteSpace/>
        <WingBlank>
          <Button type="primary" onClick={this.handleRegister}>注册</Button>
        </WingBlank>
        <WhiteSpace/>
      </div>
    )
  }
}

export default Register
