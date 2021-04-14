import io, { Socket } from 'socket.io'
import AccountChat, { MessageRequest } from './services/account/AccountChat'

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
      // socket.on('CHAT:LIST', ({ id, offset, limit }: {  }) => {

      // })
      socket.on('CHAT:JOIN', (chat_id) => {
        socket.join(`${chat_id}`)
      })
      socket.on('CHAT:MESSAGE_SEND', async (data: MessageRequest) => {
        // const response = await AccountChat.setMessage(data)
        // console.log(response)
        if (data.chat_id) socket.to(`${data.chat_id}`).emit('CHAT:MESSAGE_SENDED', { chat_id: data.chat_id, message: data })
      })
      // socket.on('PROFILE:SET_STATUS', () => {

      // })
    })
  }
}
