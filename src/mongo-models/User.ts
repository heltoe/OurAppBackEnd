import bcrypt from 'bcrypt'
// @ts-ignore
import generateUniqueId from 'generate-unique-id'

import { db } from '../adapter-db-connector'
class User {
  public async getUser(id: string) {
    try {
      const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
      return user
    } catch(e) {
      return e.message
    }
  }
  public async createUser({ email, password }: { email: string, password: string }) {
    try {
      const user = await db.query(
        'INSERT INTO users (id, email, password, repassword, role) values ($1, $2, $3, $4, $5) RETURNING *',
        [generateUniqueId({ length: 20, useLetters: false, useNumbers: true }), email, bcrypt.hashSync(password, 10), '', 'user']
      )
      return user
    } catch(e) {
      return e.message
    }
  }
  public async updateUser(payload: { id: number, email?: string | null, password?: string | null, repassword?: string | null }) {
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
    const user = await db.query(`UPDATE users SET ${requestString} WHERE id = $1 RETURNING *`, [data])
    return user
  }
  public async getUsers(limit: number | null = null, offset: number | null = null) {
    try {
      let requestString = ''
      if (offset) requestString += ` OFFSET ${offset}`
      if (limit) requestString += ` LIMIT ${limit}`
      const users = await db.query(`SELECT * FROM users${requestString}`)
      return users
    } catch(e) {
      return e.message
    }
  }
}

const user = new User()
export default user
