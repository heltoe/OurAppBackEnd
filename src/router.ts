import { Router } from 'express'
import Registration from './services/enter-to-app/Registration'
import ResetPassword from './services/enter-to-app/ResetPassword'
import Login from './services/enter-to-app/Login'
import Logout from './services/enter-to-app/Logout'
import Token from './token-creator/tokenCreator'
import authMiddleware from './middleware/auth'
import UserData from './services/account/UserData'

export type ErrorResponse = {
  status: string
}
class Routes {
  public router: Router
  constructor() {
    this.router = Router()
    this.routes()
  }
  private routes(): void {
    // enter-to-app-service
    this.router.post('/api/registration', Registration.registration)
    this.router.post('/api/reset-password', ResetPassword.resetPassword)
    this.router.post('/api/login', Login.login)
    this.router.post('/api/logout', Logout.logout)
    this.router.post('/api/refresh-tokens', Token.refreshTokens.bind(Token))
    // user data
    this.router.get('/api/user-data/:id', UserData.getUserData)
    this.router.post('/api/create-user-data/:id', UserData.createUserData)
    this.router.post('/api/update-user-data/:id', UserData.updateUserData)
  }
}

const routes = new Routes()
export default routes.router