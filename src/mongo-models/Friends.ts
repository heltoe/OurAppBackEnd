import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserFriendsSchema = createSchema({
  userId: Type.string({ required: true }),
  friends: Type.array({ required: true }).of(Type.string({ required: true, unique: true }))
})

const userFriends = typedModel('friends', UserFriendsSchema)
export default userFriends