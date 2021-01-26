import { createSchema, Type, typedModel } from 'ts-mongoose'

export const TokenSchema = createSchema({
  tokenId: Type.string({ required: true }),
  userId: Type.string({ required: true }) // TODO read-only
})

const token = typedModel('tokens', TokenSchema)
export default token
