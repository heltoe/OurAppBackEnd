import { createSchema, Type, typedModel } from 'ts-mongoose'

const genders = ['male', 'female'] as const

export const UserDataSchema = createSchema({
  userId: Type.string({ required: true }), // TODO read-only
  firstName: Type.string({ required: true }),
  lastName: Type.string({ required: true }),
  birthDate: Type.string({ required: true }),
  birthPlace: Type.string({ default: '' }),
  gender: Type.string({ required: true, enum: genders }),
  status: Type.string({ default: '' }),
  maritalStatus: Type.number({ default: 0 }),
  photo: Type.string({ default: '' })
})
const UserData = typedModel('user-data', UserDataSchema)
export default UserData
