import { Request, Response } from 'express'
import adapterDBConnector from '../../adapter-db-connector'
import { LimitedRows } from './AccountFriends'
import { tables } from '../../models/Tables'
import { errorFeedBack } from '../../FeedBack'
import { Chat, Message } from '../../models/Types'

type MessageRequest = {
  id_chat: number | null
  author: number
  message: string
  date: string
  recipient: number | null
}
class AccountChat {
  public async getListChat(req: Request, res: Response) {
    try {
      const user_id: string = req.params.user_id
      const { offset, limit } = req.query as LimitedRows
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const { rows, count }: { rows: Chat[], count: number } = await tables.chats.getEssences({
        identify_data: { sendler_id: parseInt(user_id) },
        offset: offset && limit ? parseInt(offset) * parseInt(limit) : null,
        limit: limit ? parseInt(limit): null
      })
      return res.status(201).json({
        count,
        next: limit && offset && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(offset)) ? parseInt(limit) * (parseInt(offset) || 1) < count : false,
        results: rows
      })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getChatContent(req: Request, res: Response) {
    try {
      const id_chat: string = req.params.id_chat
      const { offset, limit } = req.query as LimitedRows
      if (!id_chat && !id_chat.length) throw new Error(errorFeedBack.requiredFields)
      const { rows, count }: { rows: any[], count: number } = await tables.messages.getEssencesJoin({
        from: 'chat_messages',
        join: 'users_chat',
        identifyFrom: 'id_chat',
        identifyJoin: 'id_message',
        fields: ['id_message', 'author','message','date'],
        limit: limit ? parseInt(limit) : null,
        offset: offset && limit ? parseInt(offset) * parseInt(limit) : null,
      })
      return res.status(200).json({
        count,
        next: limit && offset && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(offset)) ? parseInt(limit) * (parseInt(offset) || 1) < count : false,
        results: rows
      })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async setMessage(req: Request, res: Response) {
    try {
      const { id_chat, author, message, date, recipient }: MessageRequest = req.body
      if (!author || (message && !message.length) || (date && !date.length)) throw new Error(errorFeedBack.requiredFields)
      let idExistedChat  = id_chat
      // Проверка на то есть ли чат
      if (!idExistedChat && recipient) {
        const isExistChat = await this.isExistChat([author, recipient])
        if (isExistChat) throw new Error(errorFeedBack.requiredFields)
        const chat: Chat = await tables.chats.createEssence({ members: `{${author},${recipient}}` })
        idExistedChat = chat.id_chat
      }
      const saved_message: Message  = await tables.messages.createEssence({
        id_chat: idExistedChat,
        author,
        message,
        date
      })
      await tables.chats.updateEssence({ id_chat: idExistedChat }, { last_message_id: saved_message.id_message })
      return res.status(201).json({ id_chat: idExistedChat })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async isExistChat(arr: number[]) {
    try {
      const searchRow = arr.map((item, index) => {
        const searchString = []
        let counter = 0
        while(counter < arr.length) {
          searchString.push(`members[${counter + 1}] = $${index + 1}`)
          counter++
        }
        return searchString.join(' OR ')
      }).join(' OR ')
      const responce = await adapterDBConnector.getDb().query(`SELECT * FROM users_chat WHERE ${searchRow}`, arr)
      return responce.rows.length > 0
    } catch(e) {
      throw new Error(e.message);
    }
  }
}
const accountChat = new AccountChat()
export default accountChat
