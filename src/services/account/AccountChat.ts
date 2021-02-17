import { Request, Response } from 'express'
import { ExtractDoc } from 'ts-mongoose'
import Chats from '../../mongo-models/message/Chats'
import Content, { ContentChatSchema } from '../../mongo-models/message/Message'
import { errorFeedBack } from '../../FeedBack'

class AccountChat {
  public async getListChat(req: Request, res: Response) {
    try {
      const userId: string = req.params.id
      const { page, limit } = req.query as { page: string | null, limit: string | null }
      if (!userId && !userId.length) throw new Error(errorFeedBack.requiredFields)
      const accountChats = await Chats.findOne({ userId: parseInt(userId) })
      if (!accountChats) throw new Error(errorFeedBack.chat.empty)
      const count = accountChats.chats!.length
      // тянем инфу о чатах и их участников
      let chats: ExtractDoc<typeof ContentChatSchema>[] = []
      // let members: ExtractDoc<typeof ContentChatSchema>[] = []
      if (accountChats.chats!.length) {
        const requests: any = []
        accountChats.chats!.forEach(idChat => {
          requests.push(this.getChatContent(idChat))
        })
        chats = await Promise.all(requests)
      }
      const parsedChats = chats.map(item => ({
        id: item.chatId,
        members: [],
        lastMessage: item.content![item.content!.length - 1]
      }))
      return res.status(201).json({
        count,
        next: limit && page && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(page)) ? parseInt(limit) * parseInt(page) < count : false,
        results: parsedChats
      })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  // public async 
  public async getChatContent(chatId: string, page?: string, limit?: string) {
    try {
      if (!chatId && !chatId.length) throw new Error(errorFeedBack.requiredFields)
      const contentChat = await Content.findOne({ chatId })
      if (!contentChat) throw new Error(errorFeedBack.chat.empty)
      const count = contentChat.content!.length
      return {
        count,
        next: limit && page && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(page)) ? parseInt(limit) * parseInt(page) < count : false,
        results: contentChat.content!.reverse()
      }
    } catch(e) {
      return e.message
    }
  }
}
const accountChat = new AccountChat()
export default accountChat
