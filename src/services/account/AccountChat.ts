import { Request, Response } from 'express'
import adapterDBConnector from '../../adapter-db-connector'
import { LimitedRows } from './AccountFriends'
import { tables } from '../../models/Tables'
import { errorFeedBack } from '../../FeedBack'
import { Chat, Message } from '../../models/Types'

type MessageRequest = {
  chat_id: number | null
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
      const arrMessagesRequests = rows.map(item => tables.messages.getEssence({ message_id: item.last_message_id }))
      const arrMessagesResponse = await Promise.all(arrMessagesRequests)
      const parsedRows = rows.map((item, index) => {
        const { message_id, message, date, author  } = arrMessagesResponse[index]
        return {
          chat_id: item.chat_id,
          last_message_id: {
            message_id,
            message,
            date,
            author,
          },
          members: item.members
        }
      })
      return res.status(201).json({
        count,
        next: limit && offset && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(offset)) ? parseInt(limit) * (parseInt(offset) || 1) < count : false,
        results: parsedRows
      })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getChatContent(req: Request, res: Response) {
    try {
      const { user_id, recipment_id, offset, limit }: { user_id: number, recipment_id: number, offset: number, limit: number } = req.body
      const responseChat: { rows: Chat[], count: number } = await this.findListChat({
        identify_data: [user_id, recipment_id]
      })
      let chat_id: number | null = null
      let rows: Message[] = []
      let count = 0
      if (responseChat.rows.length) chat_id = responseChat.rows[0].chat_id
      if (typeof chat_id === 'number') {
        const responseMessages: { rows: Message[], count: number } = await tables.messages.getEssences({
          identify_data: { chat_id },
          limit: limit || null,
          offset: offset && limit ? offset * limit : null,
        })
        rows = responseMessages.rows
        count = responseMessages.count
      }
      return res.status(200).json({
        count,
        next: limit && offset ? limit * (offset || 1) < count : false,
        results: {
          messages: rows,
          chat_id
        }
      })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async setMessage(req: Request, res: Response) {
    try {
      const { chat_id, author, message, date, recipient }: MessageRequest = req.body
      if (!author || (message && !message.length) || (date && !date.length)) throw new Error(errorFeedBack.requiredFields)
      let idExistedChat  = chat_id
      // Проверка на то есть ли чат
      if (!idExistedChat && recipient) {
        const { count }: { rows: Chat[], count: number } = await this.findListChat({
          identify_data: [author, recipient],
          limit: 1
        })
        if (count !== 0) throw new Error(errorFeedBack.requiredFields)
        const chat: Chat = await tables.chats.createEssence({ members: `{${author},${recipient}}` })
        idExistedChat = chat.chat_id
      }
      const saved_message: Message  = await tables.messages.createEssence({
        chat_id: idExistedChat,
        author,
        message,
        date
      })
      await tables.chats.updateEssence({ chat_id: idExistedChat }, { last_message_id: saved_message.message_id })
      return res.status(201).json({ chat_id: idExistedChat, message: saved_message })
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
      return { rows, count: counter.rows.length ? parseInt(counter.rows[0].count) : 0 }
    } catch(e) {
      throw new Error(e.message);
    }
  }
}
const accountChat = new AccountChat()
export default accountChat
