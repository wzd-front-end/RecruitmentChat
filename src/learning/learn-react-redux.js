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
// 因为我们安装的react-redux是6.0b版本了，已经是采用新的context了
// 所以我们需要修改我们的context实现方法，因为context是同一个对象的时候才可以祖孙组件访问，所以我们是没法在自己编写库和正式库进行混合使用

import React from 'react'
import {bindActionCreators} from './learn-redux'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const Context = React.createContext(null)

export const connect = (mapStateToProps = state => state, mapDispatchToProps = {}) => (WrapComponent) => {
  return class ConnectComponent extends React.Component {
    static contextType = Context
    static displayName = `Connect(${getDisplayName(WrapComponent)})`

    constructor(props, context) {
      super(props, context)
      this.state = {
        props: {}
      }
    }

    componentDidMount() {

      const {store} = this.context
      // 返回值为取消监听的函数，需要在组件销毁的时候注销掉
      this.unsubscribe = store.subscribe(() => {
        this.update()
      })
      this.update()
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    update() {
      const {store} = this.context
      const stateProps = mapStateToProps(store.getState(), this.props)
      const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)

      this.setState({
        props: {
          ...this.state.props,
          ...stateProps,
          ...dispatchProps
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
  constructor(props) {
    super(props)
    this.state = {
      store: props.store
    }
  }
  render() {
    return (<Context.Provider value={{store: this.state.store}}>{this.props.children}</Context.Provider>)
  }
}
