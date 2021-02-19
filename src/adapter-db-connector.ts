import Pool from 'pg'
import { Client } from 'pg'
import settings from './settings'

class AdapterDB {
  private db: any
  constructor() {
    this.db = null
  }
  public connect() {
    this.db = new Client({
      user: 'postgres',
      password: 'postgres',
      database: 'chat',
      host: 'localhost',
      port: 5334,
      connectionString: settings.POSTGRESS_URI
    })
    return this.db.connect()
  }
  public getDb() {
    return this.db
  }
}

const adapterDBConnector = new AdapterDB()
export const db = adapterDBConnector.getDb()
export default adapterDBConnector