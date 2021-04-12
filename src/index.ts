import express, { Application } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import multer from 'multer'
// @ts-ignore
import EasyYandexS3  from 'easy-yandex-s3'
import settings from './settings'
import router from './router'
import adapterDBConnector from './adapter-db-connector'
import { errorFeedBack } from './FeedBack'
import { createServer  } from 'http'
// @ts-ignore
import io, { Socket } from 'socket.io'


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
  private io: any
  constructor() {
    this.app = express()
    this.server = createServer(this.app)
    const options = {
      // wsEngine: 'eiows',
      cors: {
        origin: '*',
      }
    }
    // @ts-ignore
    this.io = io(this.server, options)
    this.config()
    this.routes()
  }
  private config(): void {
    // our plugins
    // this.app.set('PORT', settings.PORT)
    this.app.use(express.json())
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(multer().any())
  }
  private routes(): void {
    this.app.use(router)
  }
  private startServer(): void {
    //Whenever someone connects this gets executed
    // this.io.on('connection', function(socket: Socket) {
    //   console.log('A user connected', socket);
    //   //Whenever someone disconnects this piece of code executed
    //   socket.on('disconnect', function () {
    //     console.log('A user disconnected');
    //   });
    // });
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
