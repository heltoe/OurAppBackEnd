import { Request, Response } from 'express'
import adapterDBConnector from '../../adapter-db-connector'
import { LimitedRows } from './AccountFriends'
import { tables } from '../../models/Tables'
import { errorFeedBack } from '../../FeedBack'
import { Chat, Message, ChatMembers } from '../../models/Types'

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
      const { rows, count }: { rows: Chat[], count: number } = await tables.chat_members.getEssences({
        identify_data: { user_id: parseInt(user_id) },
        offset: offset && limit ? parseInt(offset) * parseInt(limit) : null,
        limit: limit ? parseInt(limit): null
      })
      // const arrMessagesRequests = rows.map(item => tables.messages.getEssence({ message_id: item.last_message_id }))
      // const arrRecipmentRequests = rows.map(item => tables.info.getEssence({ user_id: item.members.filter(item => item !== parseInt(user_id))[0] }))
      // const arrMessagesResponse = await Promise.all(arrMessagesRequests)
      // const arrRecipmentResponse = await Promise.all(arrRecipmentRequests)
      // const parsedRows = rows.map((item, index) => {
      //   const { message_id, message, date, author  } = arrMessagesResponse[index]
      //   return {
      //     chat_id: item.chat_id,
      //     last_message: {
      //       message_id,
      //       message,
      //       date,
      //       author,
      //     },
      //     recipment: arrRecipmentResponse[index]
      //   }
      // })
      // return res.status(201).json({
      //   count,
      //   next: limit && offset && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(offset)) ? parseInt(limit) * (parseInt(offset) || 1) < count : false,
      //   results: parsedRows
      // })
      return res.status(201).json({
        rows,
        count
      })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getChatContent(req: Request, res: Response) {
    try {
      const { user_id, recipment_id, offset, limit }: { user_id: number, recipment_id: number, offset: number, limit: number } = req.body
      // const responseChat: { rows: Chat[], count: number } = await this.findListChat({
      //   identify_data: [user_id, recipment_id]
      // })
      // let chat_id: number | null = null
      // let rows: Message[] = []
      // let count = 0
      // if (responseChat.rows.length) chat_id = responseChat.rows[0].chat_id
      // if (typeof chat_id === 'number') {
      //   const responseMessages: { rows: Message[], count: number } = await tables.messages.getEssences({
      //     identify_data: { chat_id },
      //     limit: limit || null,
      //     offset: typeof offset === 'number' && typeof limit === 'number' ? offset * limit : null,
      //   })
      //   rows = responseMessages.rows
      //   count = responseMessages.count
      // }
      // return res.status(200).json({
      //   count,
      //   next: typeof limit === 'number' && typeof offset === 'number' ? limit * (offset || 1) < count : false,
      //   results: {
      //     messages: rows,
      //     chat_id
      //   }
      // })
      return res.status(200).json({ status: 'ok' })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async setMessage(req: Request, res: Response) {
    try {
      const { chat_id, author, message, date, recipient }: MessageRequest = req.body
      if (!author || (message && !message.length) || (date && !date.length)) throw new Error(errorFeedBack.requiredFields)
      let idExistedChat = chat_id
      // Проверка на то есть ли чат
      if (!idExistedChat && recipient) {
        const responceChatsAuthorMessage: { rows: ChatMembers[], count: number } = await tables.chat_members.getEssences({
          identify_data: { user_id: author },
        })
        const responceChatsRecipientMessage: { rows: ChatMembers[], count: number } = await tables.chat_members.getEssences({
          identify_data: { user_id: recipient },
        })
        const common_chat_id = responceChatsAuthorMessage.rows.filter(elementAuthor => {
          return responceChatsRecipientMessage.rows.filter(elementRecipient => elementRecipient.id === elementAuthor.id).length > 0
        })
        if (!common_chat_id.length) {
          const chat: Chat = await tables.chats.createEssence({ last_message_id: null })
          idExistedChat = chat.id
          await tables.chat_members.createEssence({
            chat_id: idExistedChat,
            user_id: author
          })
          await tables.chat_members.createEssence({
            chat_id: idExistedChat,
            user_id: recipient
          })
        }
        else {
          idExistedChat = common_chat_id[0].id
        }
      }
      const saved_message: Message  = await tables.messages.createEssence({
        chat_id: idExistedChat,
        author,
        message,
        date
      })
      await tables.chats.updateEssence({ id: idExistedChat }, { last_message_id: saved_message.id })
      return res.status(201).json({ chat_id: idExistedChat, message: saved_message })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountChat = new AccountChat()
export default accountChat
