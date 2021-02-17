import { createSchema, Type, typedModel } from 'ts-mongoose'

export const ChatSchema = createSchema({
  members: Type.array({ required: true }).of(Type.number({ unique: true })),
  lastMessageId: Type.string({ required: true }),
  lastUpdate: Type.string({ required: true }),
  contentId: Type.string({ required: true })
})

const chat = typedModel('chat', ChatSchema)
export default chat
