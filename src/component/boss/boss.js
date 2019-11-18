import React from 'react'
import axios from 'axios'

class Boss extends React.Component{
  constructor(){
    super(...arguments)
    this.state = {
      data: []
    }
  }
  componentDidMount() {
    axios.get('/user/list?type=genius')
    .then(res => {
      this.setState({data: res.data.data})
    })
  }

  render() {
    return (
      <h2>Boss</h2>
    )
  }
}

export default Boss