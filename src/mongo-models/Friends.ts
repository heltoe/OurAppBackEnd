import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserFriendsSchema = createSchema({
  userId: Type.number({ required: true, unique: true }),
  friends: Type.array({ default: [] }).of(Type.number({ unique: true }))
})

const userFriends = typedModel('friends', UserFriendsSchema)
export default userFriends