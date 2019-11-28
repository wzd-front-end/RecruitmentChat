// 说明：
// @connect是装饰器的写法，正常写法其实是App=connect(mapStateToProps, mapDispatchToProps)(App)
// connect是一个高阶组件，简单的理解高阶组件，就是接受一个组件作为参数，返回一个封装过的新组件，高阶组件有两种实现方式，代理式高阶组件和继承式高阶组件
// connect负责连接组件，给到redux里的数据放到组件的属性里，数据变化的时候能够通知组件，返回一个新的组件
// 使用function写法来实现
// export function connect(mapStateToProps, mapDispatchToProps) {
//   return function (WrapComponent) {
//     return class ConnectComponent extends React.Component {
//
//     }
//   }
// }

import React from 'react'
import PropTypes from 'prop-types'

export const connect = (mapStateToProps = state => state, mapDispatchToProps = {}) => (WrapComponent) => {
  return class ConnectComponent extends React.Component {
    static contextTypes = {
      store: PropTypes.object
    }

    constructor(props, context) {
      super(props, context)
      this.state = {
        props: {}
      }
    }

    componentDidMount() {
      this.update()
    }

    update() {
      const {store} = this.context
      const stateProps = mapStateToProps(store.getState(), this.props)
      this.setState({
        props: {
          ...stateProps,
          ...this.state.props
        }
      })
    }

    render() {
      return <WrapComponent {...this.state.props}></WrapComponent>
    }
  }
}

// Provider，把store放到context里，所有的子元素可以直接取到store
export class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext() {
    return {store: this.store}
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }

  render() {
    return this.props.children
  }
}
