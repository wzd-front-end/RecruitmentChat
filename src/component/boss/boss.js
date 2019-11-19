import React from 'react'
import {connect} from 'react-redux'
import {Card, WingBlank, WhiteSpace} from 'antd-mobile'
import {getUserList} from "../../redux/chatuser.redux";

@connect(state => state.chatuser,
  (dispatch) => {
    return {
      getUserList: (type) => {
        dispatch(getUserList(type))
      }
    }
  }
)

class Boss extends React.Component {
  constructor() {
    super(...arguments)
  }

  componentDidMount() {
    this.props.getUserList('genius')
  }

  render() {
    const Header = Card.Header
    const Body = Card.Body
    return (

      <WingBlank>
        {this.props.userlist.map(v => (
          v.avatar
            ? (<div key={v._id}>
              <WhiteSpace/>
              <Card>
                <Header
                  title={v.user}
                  thumb={require(`../img/${v.avatar}.jpeg`)}
                  thumbStyle={{width: '32px'}}
                  extra={<span>{v.title}</span>}
                ></Header>
                <Body>
                  {v.desc.split('\n').map(v => (
                    <div key={v}>{v}</div>
                  ))}
                </Body>
              </Card>
            </div>) : null
        ))}
      </WingBlank>
    )
  }
}

export default Boss
