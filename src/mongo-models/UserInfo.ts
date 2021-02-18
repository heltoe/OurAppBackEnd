// import { createSchema, Type, typedModel } from 'ts-mongoose'

// const genders = ['male', 'female'] as const

// export type DataUserInfo = {
//   userId: number
//   firstName: string
//   lastName: string
//   gender: 'male' | 'female'
//   birthDate: string,
//   status: string
//   photo: string
//   location: string
// }

// export const UserInfoSchema = createSchema({
//   userId: Type.number({ required: true, unique: true }), // TODO read-only
//   firstName: Type.string({ required: true }),
//   lastName: Type.string({ required: true }),
//   gender: Type.string({ required: true, enum: genders }),
//   birthDate: Type.string({ required: true }),
//   status: Type.string({ default: '' }),
//   photo: Type.string({ default: '' }),
//   location: Type.string({ default: '' }),
// })
// const userInfo = typedModel('user-info', UserInfoSchema)
// export default userInfo

import { db } from '../adapter-db-connector'

class UserInfo {
  public async getUserInfo(id: string) {
    try {
      const user = await db.query('SELECT * FROM users-info WHERE id = $1', [id])
      return user
    } catch(e) {
      return e.message
    }
  }
  public async createUserInfo({ userId, firstName, lastName, gender, birthDate }: { userId: number, firstName: string, lastName: string, gender: string, birthDate: string }) {
    try {
      const userInfo = await db.query(
        'INSERT INTO users-info (userId, firstName, lastName, gender, birthDate, status, photo) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [userId, firstName, lastName, gender, birthDate, 'ofline', '']
      )
      return userInfo
    } catch(e) {
      return e.message
    }
  }
  public async updateUserInfo(payload: { id: number, firstName?: string | null, lastName?: string | null, birthDate?: string | null, status?: string | null, photo?: string | null }) {
    let requestString = ''
    const data: any[] = [payload.id]
    const setRequestString = <T>(type: string, value: T) => {
      data.push(value)
      requestString += `${type} = $${data.length},`
    }
    Object.keys(payload).forEach(item => {
      // @ts-ignore
      if (payload[item] && payload[item].length) setRequestString(item, payload[item])
    })
    const user = await db.query(`UPDATE users-info SET ${requestString} WHERE id = $1 RETURNING *`, [data])
    return user
  }
  public async getUsersInfo(limit: number | null = null, offset: number | null = null) {
    try {
      let requestString = ''
      if (offset) requestString += ` OFFSET ${offset}`
      if (limit) requestString += ` LIMIT ${limit}`
      const users = await db.query(`SELECT * FROM users-info${requestString}`)
      return users
    } catch(e) {
      return e.message
    }
  }
}

const userInfo = new UserInfo()
export default userInfo
