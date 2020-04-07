import React, {Component} from './learning/react/react'
import ReactDOM from './learning/react/react-dom'

function Comp(props) {
  return <h2>hi {props.name}</h2>;
}
class Comp2 extends Component {
  render() {
    const users=[{id:1,name:'tom'},{id:2,name:'jerry'}]
    return (
      <div>
        <h2>hi {this.props.name}</h2>
        <ul>
          {users.map(user=>(<li key={user.id}>{user.name}</li>))}
        </ul>
      </div>
    )
  }
}

const jsx = (
  <div>
    <span>文本</span>
    <Comp name="kaikeba" />
    <Comp2 name="开课吧"></Comp2>
  </div>
)

ReactDOM.render(
  jsx,
  document.getElementById('root'));


