import React from 'react'
import Logo from '../../component/logo/logo'
import {List, InputItem, Radio, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {register} from '../../redux/user.redux'

@connect(
  state => state.user,
  {register}
)

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
    this.props.register(this.state)
  }

  render() {
    const RadioItem = Radio.RadioItem
    return (
      <div>
        <Logo></Logo>
        <List>
          {this.props.msg ? <div className='error-msg'>{this.props.msg}</div>:null}
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
