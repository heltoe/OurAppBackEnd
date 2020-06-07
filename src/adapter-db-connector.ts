import mongoose from 'mongoose'
import settings from './settings'

class AdapterDB {
  private dbName: string
  public db: any
  constructor() {
    this.dbName = ''
  }
  public setDbName(name: string) {
    this.dbName = name
  }
  public connect() {
    return this.dbName === 'mongodb' ? this.connectToMongoDB() : this.coonnectAnotherDB()
  }
  private connectToMongoDB() {
    return mongoose.connect(settings.MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
  private coonnectAnotherDB() {}
}

const adapterDBConnector = new AdapterDB()
export default adapterDBConnector