import { createSchema, Type, typedModel } from 'ts-mongoose'

const genders = ['male', 'female'] as const

export type DataUserInfo = {
  userId: number
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  birthDate: string,
  status: string
  photo: string
  location: string
}

export const UserInfoSchema = createSchema({
  userId: Type.number({ required: true, unique: true }), // TODO read-only
  firstName: Type.string({ required: true }),
  lastName: Type.string({ required: true }),
  gender: Type.string({ required: true, enum: genders }),
  birthDate: Type.string({ required: true }),
  status: Type.string({ default: '' }),
  photo: Type.string({ default: '' }),
  location: Type.string({ default: '' }),
  friendShip: Type.array({ default: [] }).of(Type.number({ required: true, unique: true }))
})
const userInfo = typedModel('user-info', UserInfoSchema)
export default userInfo
