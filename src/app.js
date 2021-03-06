import React from 'react';
import AuthRoute from "./component/authroute/authroute";
import BossInfo from "./container/bossinfo/bossinfo";
import GeniusInfo from "./container/geniusinfo/geniusinfo";
import Login from "./container/login/login";
import Register from "./container/register/register";
import Chat from "./component/chat/chat";
import DashBoard from "./component/dashboard/dashboard";
import { Route, Switch } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
  }
  componentDidCatch(err, info){
    console.log(err,info)
    this.setState({
      hasError: true
    })
  }
  render() {
    return (
      <div>
        <AuthRoute></AuthRoute>
        <Switch>
          <Route path='/bossinfo' component={BossInfo}></Route>
          <Route path='/geniusinfo' component={GeniusInfo}></Route>
          <Route path='/login' component={Login}></Route>
          <Route path='/register' component={Register}></Route>
          <Route path='/chat/:user' component={Chat}></Route>
          <Route component={DashBoard}></Route>
        </Switch>
      </div>
    )
  }
}

export default App
