import { Request, Response } from 'express'
import { LimitedRows } from './AccountFriends'
import { tables } from '../../models/Tables'
import { errorFeedBack } from '../../FeedBack'
import { Chat, Message, ChatMembers, File } from '../../models/Types'
import Uploader from '../../save-assets/Uploader'

type MessageRequest = {
  chat_id: number | null
  author: number
  message: string
  date: string
  recipient: number | null
  files: any[]
}
type MergedDataType = {
  chat_id: number
  last_message_id: number
  recipient_id: number
}
class AccountChat {
  public async getListChat(req: Request, res: Response) {
    try {
      const user_id: string = req.params.id
      const { offset, limit } = req.query as LimitedRows
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const { rows, count }: { rows: MergedDataType[], count: number } = await tables.chats.getEssencesJoin({
        from: 'chat_members',
        join: 'users_chat',
        identifyFrom: 'chat_id',
        identifyJoin: 'id',
        identifyBy: { user_id },
        fields: ['recipient_id','last_message_id','chat_id'],
        limit: limit ? parseInt(limit) : null,
        offset: offset && limit ? parseInt(offset) * parseInt(limit) : null,
      })
      const arrMessagesRequests = rows.map(item => tables.messages.getEssence({ id: item.last_message_id }))
      const arrRecipientRequests = rows.map(item => tables.info.getEssence({ user_id: item.recipient_id }))
      const arrMessagesResponse = await Promise.all(arrMessagesRequests)
      const arrRecipientResponse = await Promise.all(arrRecipientRequests)
      const arrImageRequests = rows.map(item => tables.files_messages.getEssence({ message_id: item.last_message_id }, false))
      const arrImageResponse: File[] = await Promise.all(arrImageRequests)
      const parsedRows = rows.map((item, index) => {
        const { id, message, date, author  } = arrMessagesResponse[index]
        return {
          chat_id: item.chat_id,
          last_message: {
            message_id: id,
            message,
            date,
            author,
            files: !Array.isArray(arrImageResponse[index])
              ? [arrImageResponse[index].source_file]
              : arrImageResponse[index]
          },
          recipient: {
            user_id: arrRecipientResponse[index].id,
            first_name: arrRecipientResponse[index].first_name,
            last_name: arrRecipientResponse[index].last_name,
            gender: arrRecipientResponse[index].gender,
            birth_date: arrRecipientResponse[index].birth_date,
            phone: arrRecipientResponse[index].phone,
            croped_photo: arrRecipientResponse[index].croped_photo,
            original_photo: arrRecipientResponse[index].original_photo,
          }
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
      const { user_id, recipient_id, chat_id, offset, limit }: { user_id: number, recipient_id?: number, chat_id?: number, offset: number, limit: number } = req.body
      let local_chat_id: number | null = chat_id || null
      let rows: Message[] = []
      let count = 0
      if (!local_chat_id && typeof recipient_id === 'number') {
        const responseChat: ChatMembers = await tables.chat_members.getEssence({ user_id, recipient_id })
        if (responseChat) local_chat_id = responseChat.chat_id
      }
      if (typeof local_chat_id === 'number') {
        const responseMessages: { rows: Message[], count: number } = await tables.messages.getEssences({
          identify_data: { chat_id: local_chat_id },
          limit: limit || null,
          offset: typeof offset === 'number' && typeof limit === 'number' ? offset * limit : null,
        })
        rows = responseMessages.rows
        count = responseMessages.count
      }
      if (rows.length) {
        const arrFilesRequest = rows.map(item => tables.files_messages.getEssences({ identify_data: { message_id: item.id } }))
        const arrFilesResponse = await Promise.all(arrFilesRequest)
        // @ts-ignore
        rows = rows.map((item, index) => ({ ...item, files: arrFilesResponse[index].rows.map(item => item.source_file) }))
      }
      return res.status(200).json({
        count,
        next: typeof limit === 'number' && typeof offset === 'number' ? limit * (offset || 1) < count : false,
        results: {
          messages: rows,
          chat_id: local_chat_id
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
          const chat: Chat = await tables.chats.createEssence({ last_message_id: -1 })
          idExistedChat = chat.id
          await tables.chat_members.createEssence({
            chat_id: idExistedChat,
            user_id: author,
            recipient_id: recipient
          })
          await tables.chat_members.createEssence({
            chat_id: idExistedChat,
            user_id: recipient,
            recipient_id: author
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
      let local_photos: any[] = []
      if (req.files && req.files.length) {
        // @ts-ignore
        const photoRequest = req.files.map(item => Uploader.uploadFile(item))
        const photoResponse = await Promise.all(photoRequest)
        const arrSetToDbPhotosRequest = photoResponse.map(item => tables.files_messages.createEssence({ message_id: saved_message.id, source_file: item }))
        local_photos = await Promise.all(arrSetToDbPhotosRequest)
      }
      await tables.chats.updateEssence({ id: idExistedChat }, { last_message_id: saved_message.id })
      return res.status(201).json({ chat_id: idExistedChat, message: { ...saved_message, files: local_photos.map(item => item.source_file) }})
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountChat = new AccountChat()
export default accountChat
