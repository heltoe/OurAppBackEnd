import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import multer from 'multer'
// @ts-ignore
import EasyYandexS3  from 'easy-yandex-s3'
import settings from './settings'
import router from './router'
import SocketListener from './socket-listener'
import adapterDBConnector from './adapter-db-connector'
import { errorFeedBack } from './FeedBack'
import { createServer  } from 'http'


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
  private server: any
  private socket: any
  constructor() {
    this.app = express()
    this.server = createServer(this.app)
    this.config()
    this.routes()
  }
  private config(): void {
    // our plugins
    this.app.use(express.json())
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(multer().any())
  }
  private routes(): void {
    this.app.use(router)
    this.socket = new SocketListener(this.server)
  }
  private startServer(): void {
    this.server.listen(settings.PORT, () => console.log(`Server started on ${settings.DOMAIN}`))
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
