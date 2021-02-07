import { createSchema, Type, typedModel } from 'ts-mongoose'

export const ChatMessagesSchema = createSchema({
  userId: Type.number({ required: true, unique: true }),
  chatId: Type.string({ required: true }),
  chatMessages: Type.array().of({
    message: Type.object().of({
      recipientId: Type.string({ required: true }),
      messageTxt: Type.string({ required: true }),
      messageFile: Type.string({ required: true })
    })
  })
})

const chatMessages = typedModel('chat-messages', ChatMessagesSchema)
export default chatMessages