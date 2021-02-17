import { createSchema, Type, typedModel } from 'ts-mongoose'

export const MessageSchema = createSchema({
  chatId: Type.string({ required: true, unique: true }),
  messageId: Type.string({ required: true }),
  authorId: Type.string({ required: true }),
  messageDate: Type.string({ required: true }),
  messageTxt: Type.string({ required: true }),
  messageFile: Type.array({ default: [] }).of(Type.string({ default: '' }))
})

const message = typedModel('message', MessageSchema)
export default message
