import React from 'react'
import { Grid, List, Flex } from 'antd-mobile'
import PropTypes from 'prop-types'


class AvatarSelector extends React.Component {
  static PropTypes = {
    selectAvatar: PropTypes.func
  }

  constructor() {
    super(...arguments)
    this.state = {}
  }

  selectAvatar = (elm) => {
    this.setState(elm)
    this.props.selectAvatar(elm.text)
  }

  render() {
    const avatarList = 'one,two,three,four,five,six,seven,eight,nine,ten,eleven,twelev,thirteen,fourteen,fifteen'
      .split(',')
      .map(v => ({
        icon: require(`../img/${v}.jpeg`),
        text: v
      }))
    const gridHeader = this.state.icon
      ? (<Flex align='center'>
        <span style={{ paddingRight: 8, lineHeight: '20px' }}>已选头像</span>
        <img style={{ width: 20 }} src={this.state.icon} />
      </Flex>)
      : <span style={{ lineHeight: '20px' }}>请选择头像</span>

    return (
      <div>
        <List renderHeader={() => gridHeader}>
          <Grid
            data={avatarList}
            columnNum={5}
            onClick={this.selectAvatar}
          ></Grid>
        </List>
      </div>
    )
  }
}
export default AvatarSelector