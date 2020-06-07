import { createSchema, Type, typedModel } from 'ts-mongoose'

export const TokenSchema = createSchema({
  tokenId: Type.string({ required: true }),
  userId: Type.string({ required: true })
})

const Token = typedModel('tokens', TokenSchema)
export default Token
