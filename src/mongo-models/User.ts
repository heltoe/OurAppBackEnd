import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserSchema = createSchema({
  id: Type.number({ required: true, unique: true }),
  email: Type.string({ required: true, unique: true }),
  password: Type.string({ required: true }),
  repassword: Type.string({ default: '' }),
  role: Type.string({ default: 'user' }),
})

const user = typedModel('users', UserSchema)
export default user
