import { Client } from 'pg'
import settings from './settings'

class AdapterDB {
  private db: any
  constructor() {
    this.db = null
  }
  public connect() {
    this.db = new Client({
      user: settings.POSTGRES_USER,
      password: settings.POSTGRES_PASSWORD,
      database: settings.POSTGRES_DB,
      host: settings.POSTGRES_HOST,
      port: Number(settings.POSTGRES_PORT),
      connectionString: settings.POSTGRESS_URI,
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