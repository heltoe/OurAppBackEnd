import adapterDBConnector, { db } from '../adapter-db-connector'
import { errorFeedBack } from '../FeedBack'

export class CommonEssence {
  private tableName: any
  constructor(tableName: string) {
    this.tableName = tableName
  }
  public async createEssence(payload: Object) {
    try {
      const { rows } = await adapterDBConnector.getDb().query(
        `INSERT INTO ${this.tableName} (${Object.keys(payload).join(', ')}) values (${Object.keys(payload).map((item, index) => `$${index + 1}`).join(', ')}) RETURNING *`,
        Object.values(payload)
      )
      return rows[0]
    } catch(e) {
      throw new Error(e.message)
    }
  }
  public async getEssence(identify_data: Object) {
    try {
      const { rows } = await adapterDBConnector.getDb().query(
        `SELECT * FROM ${this.tableName} WHERE ${Object.keys(identify_data).map((item, index) => `${item} = $${index + 1}`).join(', ')}`,
        Object.values(identify_data)
      )
      if (!rows.length) throw new Error(errorFeedBack.commonEmpty)
      return rows[0]
    } catch(e) {
      throw new Error(e.message)
    }
  }
  public async getEssences({ identify_data = null, limit = null, offset = null }: { identify_data?: Object | null, limit?: number | null, offset?: number | null }) {
    try {
      let requestString = ''
      if (offset) requestString += ` OFFSET ${offset}`
      if (limit) requestString += ` LIMIT ${limit}`
      let query = `SELECT * FROM ${this.tableName}${requestString}`
      if (identify_data) {
        query += ' WHERE'
        Object.keys(identify_data).forEach((item, index) => query += `${item} = $${index + 1}`)
      }
      const { rows } = await adapterDBConnector.getDb().query(query, identify_data ? Object.values(identify_data) : [])
      if (!rows.length) throw new Error(errorFeedBack.commonEmpty)
      return rows[0]
    } catch(e) {
      throw new Error(e.message)
    }
  }
  public async updateEssence(identify_data: Object, payload: Object) {
    try {
      const count = Object.keys(payload).length
      const { rows } = await adapterDBConnector.getDb().query(
        `UPDATE ${this.tableName} SET ${Object.keys(payload).map((item, index) => `${item} = $${index + 1}`).join(', ')} WHERE ${Object.keys(identify_data).map((item, index) => `${item} = $${count + index + 1}`).join(', ')} RETURNING *`,
        [...Object.values(payload), ...Object.values(identify_data)]
      )
      return rows[0]
    } catch(e) {
      throw new Error(e.message)
    }
  }
  public async deleteEssence(identify_data: Object) {
    try {
      await adapterDBConnector.getDb().query(
        `DELETE FROM ${this.tableName} WHERE ${Object.keys(identify_data).map((item, index) => `$${index + 1}`).join(', ')}`,
        Object.values(identify_data)
      )
      return 'ok'
    } catch(e) {
      throw new Error(e.message)
    }
  }
}
