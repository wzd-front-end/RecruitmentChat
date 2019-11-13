import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {loadData} from '../../redux/user.redux'
import {connect} from 'react-redux'


//因为AuthRoute并不是路由组件，所以他没有操纵路由得方法，即我们直接访问this.props.history是会得到undefault
//withRouter是由react-router提供得一个高阶组件，我们可以使用它将路由相关得方法传入this.props
//@withRouter是一种修饰符得写法
@withRouter
@connect(
  null,
  {loadData}
)

class AuthRoute extends React.Component {
  componentDidMount() {
    const publicList = ['/login', '/register']
    const pathname = this.props.location.pathname
    if (publicList.indexOf(pathname) > 0) {
      return null
    }
    axios.get('/user/info').then(
      res => {
        if (res.status === 200) {
          if (res.data.code === 0) {
            this.props.loadData(res.data.data)
          } else {
            this.props.history.push('/login')
          }
          console.log(res.data)
        }
      }
    )
  }

  render() {
    return null
  }
}

export default AuthRoute
