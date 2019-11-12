import axios from 'axios'

//actionTypes
const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
const ERROR_MSG = 'ERROR_MSG'


const initState = {
  isAuth: '',
  msg: '',
  user: '',
  pwd: '',
  type: ''
}

//reducers
export function user(state = initState, action) {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {...state, msg: '', isAuth: true, ...action.payload}
    case ERROR_MSG:
      return {...state, isAuth: false, msg: action.msg}
    default:
      return state
  }
}

// 下面是action，个人不喜欢这个项目结构安排，乱乱的，actionTypes，action，以及reducer都放在一个文件，不妥
//鉴于课程是这么安排的，先跟着，看看有没有什么特别用意
function errorMsg(msg) {
  return {type: ERROR_MSG, msg}
}

function registerSuccess(data) {
  return {type: REGISTER_SUCCESS, payload: data}
}

export function register({user, pwd, repeatpwd, type}) {
  if (!user || !pwd || !type) {
    return errorMsg('用户名密码必须输入')
  }

  if (pwd !== repeatpwd) {
    return errorMsg('密码和确认密码不同')
  }

  return dispatch => {
    axios.post('/user/register',{
      user,
      pwd,
      type
    }).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(registerSuccess({user, pwd, type}))
      } else {
        dispatch(errorMsg(res.data.msg))
      }
    })
  }
}