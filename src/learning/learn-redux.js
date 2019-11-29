export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer)
  }

  let currentState = {}
  let currentListeners = []

  function getState() {
    return currentState
  }

  function subscribe(listener) {
    currentListeners.push(listener)
  }

  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(v => v())
    return action
  }

  // 目的是为了初始化的时候，currentState可以拿到初始值，注意这个type类型不要和用户同名，所以要命名复杂点
  dispatch({type: '@WZD/LEARN-REDUX'})
  return {getState, subscribe, dispatch}
}

export function applyMiddleware(middleware) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: (...argus) => dispatch(...argus)
    }
    dispatch = middleware(midApi)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}













