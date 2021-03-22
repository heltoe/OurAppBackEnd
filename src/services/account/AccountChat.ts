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
      const user_id: string = req.params.id
      const { offset, limit } = req.query as LimitedRows
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const { rows, count }: { rows: Chat[], count: number } = await this.findListChat({
        identify_data: [parseInt(user_id)],
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
      const { user_id, recipment_id, offset, limit }: { user_id: number, recipment_id: number, offset: number, limit: number } = req.body
      const response: { rows: Chat[], count: number } = await this.findListChat({
        identify_data: [user_id, recipment_id],
        limit: 1
      })
      const id_chat: number = response.rows[0].id_chat
      if (!id_chat) throw new Error(errorFeedBack.requiredFields)
      const { rows, count }: { rows: any[], count: number } = await tables.messages.getEssencesJoin({
        from: 'chat_messages',
        join: 'users_chat',
        identifyFrom: 'id_chat',
        identifyJoin: 'id_chat',
        fields: ['id_message', 'author','message','date'],
        limit: limit || null,
        offset: offset && limit ? offset * limit : null,
      })
      return res.status(200).json({
        count,
        next: limit && offset ? limit * (offset || 1) < count : false,
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
        const { count }: { rows: Chat[], count: number } = await this.findListChat({
          identify_data: [author, recipient],
          limit: 1
        })
        if (count === 0) throw new Error(errorFeedBack.requiredFields)
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
  public async findListChat({
    identify_data = [],
    limit = null,
    offset = null,
  }:
  {
    identify_data?: number[],
    limit?: number | null,
    offset?: number | null,
  }) {
    try {
      let requestString = ''
      if (offset) requestString += ` OFFSET ${offset}`
      if (limit) requestString += ` LIMIT ${limit}`
      const searchRow = identify_data.map((item, index) => {
        const searchString = []
        let counter = 0
        while(counter < identify_data.length) {
          searchString.push(`members[${counter + 1}] = $${index + 1}`)
          counter++
        }
        return searchString.join(' OR ')
      }).join(' OR ')
      let result = 'SELECT * FROM users_chat'
      if (searchRow.length) result += ` WHERE ${searchRow}`
      if (requestString.length ) result += requestString
      const { rows } = await adapterDBConnector.getDb().query(result, identify_data)
      const counter = await adapterDBConnector.getDb().query(result, identify_data)
      return { rows, count: parseInt(counter.rows[0].count) }
    } catch(e) {
      throw new Error(e.message);
    }
  }
}
const accountChat = new AccountChat()
export default accountChat
