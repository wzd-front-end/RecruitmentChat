import React from 'react'
import {connect} from 'react-redux'
import {Result, List, WhiteSpace, Modal} from "antd-mobile";
import browserCookie from 'browser-cookies'
import {logoutSubmit} from '../../redux/user.redux'

@connect(
  state => state.user,
  {logoutSubmit}
)
class User extends React.Component {
  constructor() {
    super(...arguments)
    this.logout = this.logout.bind(this)
  }

  logout(e) {
    const alert = Modal.alert
    alert('注销', '确认退出登录吗？', [
      {text: '取消', onPress: () => console.log('cancel')},
      {
        text: '确认', onPress: () => {
          browserCookie.erase('userid')
          this.props.logoutSubmit()
          this.props.history.push('/login')
        }
      }
    ])
  }

  render() {
    const props = this.props
    const Item = List.Item
    const Brief = Item.Brief
    return props.user
      ? (<div>
        <Result
          img={<img style={{width: '60px'}} alt='头像' src={require(`../img/${props.avatar}.jpeg`)}/>}
          title={props.user}
          message={props.type === 'boss' ? props.company : null}
        />
        <List renderHeader={() => '简介'}>
          <Item>
            {props.title}
            {this.props.desc.split('\n').map(v => <Brief key={v}>{v}</Brief>)}
            {props.money ? <Brief>薪资：{props.money}</Brief> : null}
          </Item>
        </List>
        <WhiteSpace></WhiteSpace>
        <List>
          <Item onClick={this.logout}>退出登录</Item>
        </List>
      </div>)
      : null
  }
}

export default User
