import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import settings from './settings'
import router from './router'
import adapterDBConnector from './adapter-db-connector'
import { errorFeedBack } from './FeedBack'

class Server {
  private app: Application
  constructor() {
    this.app = express()
    this.config()
    this.routes()
  }
  private config(): void {
    // ours plugins
    this.app.set('PORT', settings.PORT)
    this.app.use(express.json())
    this.app.use(helmet())
    this.app.use(cors())
  }
  private routes(): void {
    this.app.use(router)
  }
  private startServer(): void {
    this.app.listen(this.app.get('PORT'), () => console.log(`Server started on ${settings.DOMAIN}`))
  }
  public async init() {
    try {
      adapterDBConnector.setDbName(settings.DBNAME)
      await adapterDBConnector.connect()
      this.startServer()
    } catch(e) {
      console.log(errorFeedBack.connectDb)
    }
  }
}
const server = new Server()
server.init()
