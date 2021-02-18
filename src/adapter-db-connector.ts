import Pool from 'pg'

class AdapterDB {
  private db: any
  constructor() {
    this.db = null
  }
  public connect() {
    this.db = new Pool.Pool({
      user: 'admin',
      password: 'admin',
      database: 'chatApi',
      host: 'localhost',
      port: 5432
    })
  }
  public getDb() {
    return this.db
  }
}

const adapterDBConnector = new AdapterDB()
export const db = adapterDBConnector.getDb()
export default adapterDBConnector