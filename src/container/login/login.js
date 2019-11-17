import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { login } from '../../redux/user.redux'

@connect(
  state => state.user,
  { login }
)

class Login extends React.Component {
  constructor() {
    super(...arguments)
    this.register = this.register.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.state = {
      user: '',
      pwd: ''
    }
  }

  handleLogin() {
    this.props.login(this.state)
  }

  handleChange(key, val) {
    this.setState({
      [key]: val
    })
  }

  register() {
    console.dir(this.props)
    this.props.history.push('/register')
  }
  render() {
    return (
      <div>
        {this.props.redirectTo ? <Redirect to={this.props.redirectTo} /> : null}
        <Logo></Logo>
        <WingBlank>
          <List>
            {this.props.msg ? <div className='error-msg'>{this.props.msg}</div> : null}
            <InputItem onChange={v => this.handleChange('user', v)}>用户</InputItem>
            <InputItem onChange={v => this.handleChange('pwd', v)} type='password'>密码</InputItem>
          </List>
          <WhiteSpace />
          <Button type='primary' onClick={this.handleLogin}>登录</Button>
          <WhiteSpace />
          <Button type='primary' onClick={this.register}>注册</Button>
        </WingBlank>
      </div>
    )
  }
}

export default Login
