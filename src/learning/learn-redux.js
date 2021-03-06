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
    const unsubscribe = () => {
      currentListeners = currentListeners.filter(v => v !== listener)
    }
    return unsubscribe
  }

  function dispatch(action) {
    // 这里说明了为什么reducer需要返回全新得状态，因为是对老状态的覆盖
    currentState = reducer(currentState, action)
    currentListeners.forEach(v => v())
    return action
  }

  // 目的是为了初始化的时候，currentState可以拿到初始值，注意这个type类型不要和用户同名，所以要命名复杂点
  dispatch({type: `@@redux/__INIT__${Math.random()}`})
  return {getState, subscribe, dispatch}
}

export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: (...argus) => dispatch(...argus)
    }
    const middlewareChain = middlewares.map(middleware => middleware(midApi))
    dispatch = compose(...middlewareChain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}

export function compose(...funs) {
  if (funs.length === 0) {
    return args => args
  }

  if (funs.length === 1) {
    return funs[0]
  }
  /** [f1 , f2, f3]，执行顺序是f1(f2(f3()))()，先执行内括号的，之后再往外执行，执行完内括号的后，会返回一个封装了里层需要执行的特有逻辑的next函数，返回给外层的中间件
   *  一层一层的封装直到最外层f1，最后大概是 (...args) => f1(f2(f3(args)))的形式，然后将dispatch传入作为最里层的next，执行f1，这过程next()会不断往里层执行,直到最里层next === dispatch
   */

  return funs.reduce((ret, item) => (...args) => ret(item(...args)))
}

function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args))
}

export function bindActionCreators(creators, dispatch) {
  let bound = {}
  if (typeof creators === 'object') {
    Object.keys(creators).forEach(v => {
      let creator = creators[v]
      bound[v] = bindActionCreator(creator, dispatch)
    })
  } else if (typeof creators === 'function') {
    bound = creators(dispatch)
    if (typeof bound !== 'object') {
      throw new Error(`the parameter of connect which name is ${creators.name} must return an object`)
    }
  }
  return bound
}

export function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers)
  return function combination(state, action) {
    if (state === void 0) {
      state = {}
    }
    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < reducerKeys.length; _i++) {
      var _key = reducerKeys[_i]
      const previousStateForKey = state[_key]
      const nextStateForKey = reducers[_key](previousStateForKey, action)
      nextState[_key] = nextStateForKey
      hasChanged = hasChanged || previousStateForKey !== nextStateForKey
    }

    return hasChanged ? nextState : state
  }
}
