import React, {Component} from 'react'
import {kFormCreate} from "../kFormCreate/kFormCreate";

@kFormCreate
class KFormTest extends Component {
  onSubmit = () => {
    this.props.validate((isValid, data) => {
      if (isValid) {
        console.log("提交登录", data);
      } else {
        alert("校验失败");
      }
    });
  };
  render() {
// 结构出扩展的方法
    const { getFieldDec } = this.props;
    return (
      <div>
        {getFieldDec("uname", {
          rules: [{ required: true, message: "请输入用户名" }]
        })(<input type="text" />)}
        {getFieldDec("pwd", {
          rules: [{ required: true, message: "请输入密码" }]
        })(<input type="password" />)}
        <button onClick={this.onSubmit}>登录</button>
      </div>
    );
    }
}

class Test1 extends React.Component{
  constructor(){
    super(...arguments)
  }

  componentWillMount() {
    console.log("componentWillMount")
  }

  componentDidMount() {
    console.log("componentDidMount")
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log("componentWillReceiveProps")
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    console.log("shouldComponentUpdate")
    return true
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    console.log("componentWillUpdate")
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate")
  }

  componentWillUnmount() {
    console.log("componentWillUnmount")
  }

  render() {
    console.log("render")
    return(
      <div>测试生命周期</div>
    )
  }
}

class Test extends React.Component{
  constructor(){
    super(...arguments)
    this.state = {
      count: 1
    }
  }
  handleChange = e => {
    this.setState({
      count: this.state.count + 1
    })
  }
  render() {
    return (
      <div>
        {this.state.count}
        <Test1></Test1>
        <button onClick={this.handleChange}>+</button>
      </div>
    )
  }
}
export default Test
