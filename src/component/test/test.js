import React from 'react'

class Test1 extends React.Component{
  constructor(){
    super(...arguments)
  }

  clickTest = (e) => {
    console.log('Test1冒泡')
  }

  clickCapture = () => {
    console.log('Test1捕获')
  }
  render() {
    return (<div onClick={this.clickTest} onClickCapture={this.clickCapture}><Test2></Test2></div>)
  }
}

class Test2 extends React.Component{
  constructor(){
    super(...arguments)
  }
  componentDidMount() {

  }

  clickTest = (e) => {
    console.log('Test2冒泡')
  }

  clickCapture = () => {
    console.log('Test2捕获')
  }

  render() {
    return <div data-num='33' onClick={this.clickTest} onClickCapture={this.clickCapture}>测试事件捕获和事件冒泡</div>
  }
}

class Test extends React.Component{
  render() {
    return (
      <div>
        <Test1></Test1>
      </div>
    )
  }
}
export default Test
