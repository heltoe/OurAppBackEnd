import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserMessagesSchema = createSchema({
  userId: Type.number({ required: true, unique: true }),
  messages: Type.array().of({
    recipient: Type.object().of({
      userId: Type.string({ required: true }),
      firstName: Type.string({ required: true }),
      lastName: Type.string({ required: true }),
      photo: Type.string({ required: true })
    }),
    chatId: Type.string({ required: true }),
    lastMessage: Type.string({ required: true })
  })
})

const userMessages = typedModel('chats', UserMessagesSchema)
export default userMessages