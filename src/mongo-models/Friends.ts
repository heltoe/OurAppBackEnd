import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserFriendsSchema = createSchema({
  userId: Type.number({ required: true, unique: true }),
  friends: Type.array({ required: true }).of(Type.number({ required: true, unique: true }))
})

const userFriends = typedModel('friends', UserFriendsSchema)
export default userFriends