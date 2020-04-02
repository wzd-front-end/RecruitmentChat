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

class Test extends React.Component{
  render() {
    return (
      <div>
        <KFormTest></KFormTest>
      </div>
    )
  }
}
export default Test
