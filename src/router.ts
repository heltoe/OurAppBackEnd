import { Router } from 'express'
import Registration from './services/enter-to-app/registration/Registration'
import ResetPassword from './services/enter-to-app/reset-password/ResetPassword'
import Login from './services/enter-to-app/login/Login'
import Logout from './services/enter-to-app/logout/Logout'
import Token from './token-creator/tokenCreator'
import authMiddleware from './middleware/auth'

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
    this.router.post('/api/logout', authMiddleware, Logout.logout)
    this.router.post('/api/refresh-tokens', Token.refreshTokens.bind(Token))
  }
}

const routes = new Routes()
export default routes.router