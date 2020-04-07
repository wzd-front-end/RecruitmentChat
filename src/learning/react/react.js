import {createVNode} from './vdom'

function createElement(type, props, ...children) {
  // 父元素需要子元素返回结果，这里可以通过JSX编译后的代码得出结论
  props.children = children
  let vtype
  if (typeof type === "string") {
    // 原生标签
    vtype = 1;
  } else if (typeof type === "function") {
    if (type.isClassComponent) {
      // 类组件
      vtype = 2;
    } else {
      // 函数组件
      vtype = 3;
    }
  }
  delete props.__source
  return createVNode(vtype, type, props)
}

export default {createElement}

export class Component {
// 这个组件来区分是不是class组件
  static isClassComponent = true

  constructor(props) {
    this.props = props
    this.state = {}
  }
}
