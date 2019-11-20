import React from 'react'
import PropTypes from 'prop-types'
import {Card, WhiteSpace, WingBlank} from "antd-mobile";
import {withRouter} from 'react-router-dom'

@withRouter
class UserCard extends React.Component {
  static propTypes = {
    userlist: PropTypes.array.isRequired
  }

  handleClick(v) {
    this.props.history.push(`/chat/${v.user}`)
  }

  render() {
    const Header = Card.Header
    const Body = Card.Body
    return (
      <WingBlank>
        {this.props.userlist.map(v => (
          v.avatar
            ? (<div style={{lineHeight: '22px'}} key={v._id}>
              <WhiteSpace/>
              <Card onClick={() => {this.handleClick(v)}}>
                <Header
                  title={v.user}
                  thumb={require(`../img/${v.avatar}.jpeg`)}
                  thumbStyle={{width: '32px'}}
                  extra={<span>{v.title}</span>}
                ></Header>
                <Body>
                  {v.type === 'boss' ? <div>公司：{v.company}</div> : null}
                  {v.desc.split('\n').map(d => (
                    <div key={d}>{d}</div>
                  ))}
                  {v.type === 'boss' ? <div>薪资：{v.money}</div> : null}
                </Body>
              </Card>
            </div>) : null
        ))}
      </WingBlank>
    )
  }
}

export default UserCard
