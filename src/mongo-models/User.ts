import { createSchema, Type, typedModel } from 'ts-mongoose'

export const UserSchema = createSchema({
  email: Type.string({ required: true, unique: true }),
  password: Type.string({ required: true }),
  repassword: Type.string({ default: '' }),
  role: Type.string({ default: 'user' })
})

const User = typedModel('users', UserSchema)
export default User
