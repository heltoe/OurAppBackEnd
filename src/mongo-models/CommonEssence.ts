import adapterDBConnector, { db } from '../adapter-db-connector'

export class CommonEssence {
  private tableName: any
  constructor(tableName: string) {
    this.tableName = tableName
  }
  public async getEssence(field: string, value: string) {
    try {
      const essence = await db.query(`SELECT * FROM ${this.tableName} WHERE ${field} = $1`, [value])
      return essence
    } catch(e) {
      return e.message
    }
  }
  public async createEssence<T>(payload: T) {
    try {
      let requestString = ''
      const keys: any[] = []
      const values: any[] = []
      const setRequestString = (type: string) => {
        requestString += `${type} = $${values.length},`
      }
      Object.keys(payload).forEach(item => {
        // @ts-ignore
        if (payload[item] && payload[item].length) {
          keys.push(item)
          // @ts-ignore
          values.push(payload[item])
          // @ts-ignore
          setRequestString(item, payload[item])
        }
      })
      const essence = await adapterDBConnector.getDb().query(
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
    const setRequestString = (type: string) => {
      requestString += `${type} = $${values.length},`
    }
    Object.keys(payload).forEach(item => {
      // @ts-ignore
      if (payload[item] && payload[item].length) {
        keys.push(item)
        // @ts-ignore
        values.push(payload[item])
        // @ts-ignore
        setRequestString(item, payload[item])
      }
    })
    const essence = await db.query(`UPDATE ${this.tableName} SET ${requestString} WHERE id = $1 RETURNING *`, [values])
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
