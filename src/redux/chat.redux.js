import axios from 'axios'
import io from 'socket.io-client'

const socket = io('ws://localhost:9093')

// 获取聊天列表
const MSG_LIST = 'MSG_LIST'
// 读取信息
const MSG_REVC = 'MSG_REVC'
// 标识已读
const MSG_READ = 'MSG_READ'
// 是否启动接收消息滚动
const CHANGE_SCROLL = 'CHANGE_SCROLL'

const initState = {
  chatmsg: [],
  users: {},
  unread: 0,
  canscroll: 1
}

export function chat(state = initState, action) {
  switch (action.type) {
    case CHANGE_SCROLL:
      return { ...state, canscroll: action.payload }
    case MSG_LIST:
      return {
        ...state,
        chatmsg: action.payload.msgs,
        unread: action.payload.msgs.filter(v => !v.read && v.to === action.payload.userid).length,
        users: action.payload.users
      }
    case MSG_REVC:
      const n = action.payload.msg.to === action.payload.userid ? 1 : 0
      return { ...state, chatmsg: [...state.chatmsg, action.payload.msg], unread: (state.unread + n) }
    case MSG_READ:
      const { from, num } = action.payload
      return {
        ...state,
        chatmsg: state.chatmsg.map(v => ({ ...v, read: from === v.from ? true : v.from })), unread: (state.unread - num)
      }
    default:
      return state
  }
}

function msgList(msgs, users, userid) {
  return { type: MSG_LIST, payload: { msgs, users, userid } }
}

function msgRecv(msg, userid) {
  return { type: MSG_REVC, payload: { msg, userid } }
}

function msgRead({ from, userid, num }) {
  return { type: MSG_READ, payload: { from, userid, num } }
}

export function changeScroll(type) {
  return { type: CHANGE_SCROLL, payload: type }
}

export function getMsgList() {
  return (dispatch, getState) => {
    axios.get('/user/getmsglist').then(res => {
      if (res.status === 200 && res.data.code === 0) {
        let userid = getState().user._id
        if (userid) {
          dispatch(msgList(res.data.msgs, res.data.users, userid))
        } else {
          setTimeout(() => {
            userid = getState().user._id
            dispatch(msgList(res.data.msgs, res.data.users, userid))
          }, 100)
        }
      }
    })
  }
}

export function sendMsg({ from, to, msg }) {
  return dispatch => {
    socket.emit('sendmsg', { from, to, msg })
  }
}

export function recvMsg() {
  return (dispatch, getState) => {
    socket.on('recvmsg', function (data) {
      const canscroll = getState().chat.canscroll
      if (canscroll) {
        setTimeout(function () {
          window.scrollTo(0, document.documentElement.scrollHeight)
        }, 0)
      }
      const userid = getState().user._id
      dispatch(msgRecv(data, userid))
    })
  }
}

export function readMsg(from) {
  return (dispatch, getState) => {
    axios.post('/user/readmsg', { from })
      .then(res => {
        const userid = getState().user._id
        if (res.status === 200 && res.data.code === 0) {
          dispatch(msgRead({ userid, from, num: res.data.num }))
        }
      })
  }
}
