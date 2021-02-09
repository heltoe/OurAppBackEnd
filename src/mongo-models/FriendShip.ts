import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserFriendShipSchema = createSchema({
  userId: Type.number({ required: true, unique: true }),
  friendShip: Type.array({ required: true }).of(Type.number({ required: true, unique: true }))
})

const userFriendShip = typedModel('friendship', UserFriendShipSchema)
export default userFriendShip