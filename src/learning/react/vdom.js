export function createVNode(vtype, type, props) {
  let vnode = {
    vtype: vtype,
    type: type,
    props: props
  }

  return vnode
}

export function initVNode(vnode) {
  let { vtype } = vnode;
  if (!vtype) {
    // 没有vtype，是一个文本节点
    return document.createTextNode(vnode)
  }

  if (vtype === 1) {
    // 1是原生元素
    return createElement(vnode)
  } else if (vtype === 2) {
    // 2是类组件
    return createClassComp(vnode)
  } else if (vtype === 3) {
    // 3是函数组件
    return createFuncComp(vnode)
  }
}

function createElement(vnode) {
  const {type, props} = vnode
  const node = document.createElement(type)
  // 过滤key，children等特殊props
  const {key, children, ...rest} = props
  // 需要特殊处理的属性名：class和for
  Object.keys(rest).forEach(k => {
    if (k === 'className') {
      node.setAttribute('class', rest[k])
    } else if (k === 'htmlFor') {
      node.setAttribute('for', rest[k])
    } else {
      node.setAttribute(k, rest[k]);
    }
  })
  // 递归初始化子元素
  children.forEach(c => {
    if(Array.isArray(c)){
      c.forEach(n => node.appendChild(initVNode(n)))
    } else {
      node.appendChild(initVNode(c))
    }
  })

  return node
}

// 创建函数组件
function createFuncComp(vnode) {
  const {type, props} = vnode
  // type是函数，它本身即是渲染函数，返回vdom
  const newNode = type(props)
  return initVNode(newNode)
}

// 创建类组件
function createClassComp(vnode) {
  const {type, props} = vnode
  // 创建类组件实例
  const component = new type(props)
  // 调用其render获得vdom
  const newNode = component.render()
  return initVNode(newNode)
}
