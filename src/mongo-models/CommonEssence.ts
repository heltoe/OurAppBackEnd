import { db } from '../adapter-db-connector'

class CommonEssence {
  private tableName: any
  constructor(tableName: string) {
    this.tableName = tableName
  }
  public async getEssence(id: string) {
    try {
      const essence = await db.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id])
      return essence
    } catch(e) {
      return e.message
    }
  }
  public async createEssence<T>(payload: T) {
    try {
      let requestString = ''
      const data: any[] = []
      const keys: any[] = []
      const values: any[] = []
      const setRequestString = <D>(type: string, value: D) => {
        data.push(value)
        requestString += `${type} = $${data.length},`
      }
      Object.keys(payload).forEach(item => {
        // @ts-ignore
        if (payload[item] && payload[item].length) {
          // @ts-ignore
          setRequestString(item, payload[item])
          keys.push(item)
          // @ts-ignore
          values.push(payload[item])
        }
      })
      const essence = await db.query(
        `INSERT INTO ${this.tableName} (${keys.join(', ')}) values (${keys.map((item, index) => `$${index + 1}`).join(', ')}) RETURNING *`,
        values
      )
      return essence
    } catch(e) {
      return e.message
    }
  }
  public async updateEssence<T>(id: number | string, payload: T) {
    let requestString = ''
    const data: any[] = []
    const keys: any[] = []
    const values: any[] = [id]
    const setRequestString = <D>(type: string, value: D) => {
      data.push(value)
      requestString += `${type} = $${data.length},`
    }
    Object.keys(payload).forEach(item => {
      // @ts-ignore
      if (payload[item] && payload[item].length) {
        // @ts-ignore
        setRequestString(item, payload[item])
        keys.push(item)
        // @ts-ignore
        values.push(payload[item])
      }
    })
    const essence = await db.query(`UPDATE ${this.tableName} SET ${requestString} WHERE id = $1 RETURNING *`, [data])
    return essence
  }
  public async updateOneFieldOnEssence<T>(id: number | string, type: string, payload: T) {
    const essence = await db.query(`UPDATE ${this.tableName} SET ${type} = $1 WHERE id = $1 RETURNING *`, [id, payload])
    return essence
  }
  public async getEssences(limit: number | null = null, offset: number | null = null) {
    try {
      let requestString = ''
      if (offset) requestString += ` OFFSET ${offset}`
      if (limit) requestString += ` LIMIT ${limit}`
      const users = await db.query(`SELECT * FROM ${this.tableName}${requestString}`)
      return users
    } catch(e) {
      return e.message
    }
  }
}