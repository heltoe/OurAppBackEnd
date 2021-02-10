import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserFriendShipSchema = createSchema({
  userId: Type.number({ required: true, unique: true }),
  sendedFriendShip: Type.array({ default: [] }).of(Type.number({ unique: true })),
  friendShip: Type.array({ default: [] }).of(Type.number({ unique: true }))
})

const userFriendShip = typedModel('friendship', UserFriendShipSchema)
export default userFriendShip