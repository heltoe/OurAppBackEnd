import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import multer from 'multer'
import bodyParser from 'body-parser'
// @ts-ignore
import EasyYandexS3  from 'easy-yandex-s3'
import settings from './settings'
import router from './router'
import adapterDBConnector from './adapter-db-connector'
import { errorFeedBack } from './FeedBack'

export const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: 'tq73fAvDHrzYEmxOgp27',
    secretAccessKey: '5sd2UQhjLTHCegvHvsSGOx0pHPolWRhIs2KPz1Ua',
  },
  Bucket: 'chat-storage',
  debug: false
});

class Server {
  private app: Application
  constructor() {
    this.app = express()
    this.config()
    this.routes()
  }
  private config(): void {
    // our plugins
    this.app.set('PORT', settings.PORT)
    this.app.use(express.json())
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(multer().any())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded())
    this.app.use(bodyParser.urlencoded({ extended: true }))
  }
  private routes(): void {
    this.app.use(router)
  }
  private startServer(): void {
    this.app.listen(this.app.get('PORT'), () => console.log(`Server started on ${settings.DOMAIN}`))
  }
  public async init() {
    try {
      await adapterDBConnector.connect()
      this.startServer()
    } catch(e) {
      console.log(errorFeedBack.connectDb)
    }
  }
}
const server = new Server()
server.init()
