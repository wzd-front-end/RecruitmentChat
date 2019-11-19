import React from 'react'
import {connect} from 'react-redux'
import {getUserList} from "../../redux/chatuser.redux";
import UserCard from "../usercard/usercard"

@connect(state => state.chatuser,
  (dispatch) => {
    return {
      getUserList: (type) => {
        dispatch(getUserList(type))
      }
    }
  }
)

class Genius extends React.Component {
  constructor() {
    super(...arguments)
  }

  componentDidMount() {
    this.props.getUserList('boss')
  }

  render() {
    return (
      <UserCard userlist={this.props.userlist}></UserCard>
    )
  }
}

export default Genius
