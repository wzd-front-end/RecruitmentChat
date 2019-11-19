import React from 'react'
import axios from 'axios'
import {Card, WingBlank, WhiteSpace} from 'antd-mobile'

class Boss extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    axios.get('/user/list?type=genius')
      .then(res => {
        if (res.data.code === 0) {
          this.setState({data: res.data.data})
        }
      })
  }

  render() {
    const Header = Card.Header
    const Body = Card.Body
    return (

      <WingBlank>
        {this.state.data.map(v => (
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
