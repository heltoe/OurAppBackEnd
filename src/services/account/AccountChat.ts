import { Request, Response } from 'express'
import Chats from '../../mongo-models/message/Chats'
import { errorFeedBack } from '../../FeedBack'

class AccountChat {
  public async getListChat(req: Request, res: Response) {
    try {
      const userId: string = req.params.id
      if (!userId && !userId.length) throw new Error(errorFeedBack.requiredFields)
      const accountMessages = await Chats.findOne({ userId: parseInt(userId) })
      if (!accountMessages) throw new Error(errorFeedBack.chat.empty)
      return res.status(201).json({ messages: accountMessages.messages })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountChat = new AccountChat()
export default accountChat
