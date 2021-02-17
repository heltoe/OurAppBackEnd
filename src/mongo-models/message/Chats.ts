import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserChatsSchema = createSchema({
  userId: Type.number({ required: true, unique: true }),
  chats: Type.array({ default: [] }).of(Type.string({ unique: true }))
})

const chats = typedModel('user-chats', UserChatsSchema)
export default chats
