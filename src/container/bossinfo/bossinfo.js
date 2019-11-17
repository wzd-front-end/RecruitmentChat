import React from 'react'
import { NavBar, InputItem, TextareaItem, Button, WingBlank, WhiteSpace } from 'antd-mobile'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { update } from '../../redux/user.redux'

@connect(
  state => state.user,
  { update }
)

class BossInfo extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      title: '',
      company: '',
      money: '',
      desc: '',
      avatar: ''
    }
  }

  onChange = (key, val) => {
    this.setState({
      [key]: val
    })
  }

  render() {
    return (
      <div>
        {this.props.redirectTo ? <Redirect to={this.props.redirectTo} /> : null}
        <NavBar mode='dark'>BOSS完善信息页</NavBar>
        <AvatarSelector selectAvatar={(imgname) => { this.onChange('avatar', imgname) }}></AvatarSelector>
        <InputItem onChange={(v) => this.onChange('title', v)}>
          招聘职位
        </InputItem>
        <InputItem onChange={(v) => this.onChange('company', v)}>
          公司名称
        </InputItem>
        <InputItem onChange={(v) => this.onChange('money', v)}>
          职位薪资
        </InputItem>
        <TextareaItem
          rows={3}
          autoHeight
          title='职位要求'
          onChange={(v) => this.onChange('desc', v)} >
        </TextareaItem>
        <WingBlank>
          <WhiteSpace />
          <Button
            onClick={() => {
              this.props.update(this.state)
            }}
            type='primary'>保存</Button>
        </WingBlank>
      </div>
    )
  }
}

export default BossInfo