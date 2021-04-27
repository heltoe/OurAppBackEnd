import io, { Socket } from 'socket.io'
import { UserInfo, ChatItemSocket } from './models/Types'

type IncommingMessage = {
  message_id: number
  chat_id: number
  author: number
  message: string
  date: string
  files: string[]
}

export default class SocketListener {
  private socket: any
  constructor(server: any) {
    const options = {
      // wsEngine: 'eiows',
      cors: {
        origin: '*',
      }
    }
    // @ts-ignore
    this.socket = io(server, options)
    this.listeners()
  }
  private listeners(): void {
    this.socket.on('connection', (socket: Socket) => {
      socket.on('APP:ENTER', (user_id: number) => {
        socket.join(`FRIEND_ROOM_${user_id}`)
        socket.join(`FRIENDSHIP_ROOM_${user_id}`)
        socket.join(`SIDEBAR_ROOM_${user_id}`)
        socket.join(`CALL_ROOM_${user_id}`)
      })
      socket.on('FRIENDSHIP:ADD', ({ user, recipient }: { user: UserInfo, recipient: number }) => {
        socket.to(`FRIENDSHIP_ROOM_${recipient}`).emit('FRIENDSHIP:ADD_MESSAGE_SENDED', { user, recipient })
      })
      socket.on('FRIENDSHIP:REMOVE', ({ user, recipient }: { user: UserInfo, recipient: number }) => {
        socket.to(`FRIENDSHIP_ROOM_${recipient}`).emit('FRIENDSHIP:REMOVE_MESSAGE_SENDED', { user, recipient })
      })
      //
      socket.on('FRIEND:ADD', ({ user, recipient }: { user: UserInfo, recipient: number }) => {
        socket.to(`FRIEND_ROOM_${recipient}`).emit('FRIEND:ADD_MESSAGE_SENDED', { user, recipient })
      })
      socket.on('FRIEND:REMOVE', ({ user, recipient }: { user: UserInfo, recipient: number }) => {
        socket.to(`FRIEND_ROOM_${recipient}`).emit('FRIEND:REMOVE_MESSAGE_SENDED', { user, recipient })
      })
      //
      socket.on('CHAT:JOIN', (chat_id: number) => {
        socket.join(`CHAT_ROOM_${chat_id}`)
      })
      socket.on('CHAT:MESSAGE_SEND', (data: IncommingMessage) => {
        if (data.chat_id) socket.to(`CHAT_ROOM_${data.chat_id}`).emit('CHAT:MESSAGE_SENDED', data)
      })
      socket.on('SIDEBAR:MESSAGE_SEND', (data: ChatItemSocket) => {
        socket.to(`SIDEBAR_ROOM_${data.user_id}`).emit('SIDEBAR:MESSAGE_SENDED', data)
      })
      //
      socket.on('CALL:CALL_TO_USER', (data: { user: UserInfo, recipient: UserInfo }) => {
        socket.to(`CALL_ROOM_${data.recipient.user_id}`).emit('CALL:CATCH_CALL_TO_USER', data)
      })
      socket.on('CALL:APPLY_OFFER_CALL', (data: { to: number, recipient: UserInfo, sendler: UserInfo }) => {
        socket.to(`CALL_ROOM_${data.to}`).emit('CALL:CREATE_OFFER_SDP', { recipient: data.recipient, sendler: data.sendler })
      })
      socket.on('CALL:DECLINE_OFFER_CALL', (user_id: number) => {
        socket.to(`CALL_ROOM_${user_id}`).emit('CALL:DECLINE_CLEAN_CALL_DATA')
      })
      //
      socket.on('CALL:SEND_OFFER_SDP', (data: { to: number, signal: any }) => {
        socket.to(`CALL_ROOM_${data.to}`).emit('CALL:CREATE_ANSWER_SDP', data)
      })
      socket.on('CALL:SEND_ANSWER_SDP', (data: { to: number, signal: any }) => {
        socket.to(`CALL_ROOM_${data.to}`).emit('CALL:CATCH_ANSWER_SDP', data.signal)
      })
      socket.on('CALL:LEAVE_FROM_CALL', (data: { to: number, from: UserInfo }) => {
        socket.to(`CALL_ROOM_${data.to}`).emit('CALL:LEAVED_FROM_CALL', data.from)
      })
    })
  }
}
