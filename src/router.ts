import { Router } from 'express'
import Registration from './services/enter-to-app/Registration'
import ResetPassword from './services/enter-to-app/ResetPassword'
import Login from './services/enter-to-app/Login'
import Logout from './services/enter-to-app/Logout'
import Token from './token-creator/tokenCreator'
import authMiddleware from './middleware/auth'
import AccountInfo from './services/account/AccountInfo'
import AccountFriends from './services/account/AccountFriends'
import AccountChat from './services/account/AccountChat'

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
    // person info
    this.router.post('/api/personal-info', Token.getUserIdByToken)
    this.router.get('/api/user-data/:id', AccountInfo.getPersonInfo)
    this.router.post('/api/create-user-data', AccountInfo.createPersonInfo)
    this.router.put('/api/update-user-data', AccountInfo.updatePersonInfo)
    this.router.post('/api/remove-account', AccountInfo.removeAccount)
    // person friends
    this.router.get('/api/user-list/:id', AccountFriends.getUserList)
    this.router.get('/api/user-friends/:id', AccountFriends.getFriends)
    this.router.get('/api/user-friendship/:id', AccountFriends.getFriendShipList)
    this.router.post('/api/add-user-friend', AccountFriends.createFriend)
    this.router.delete('/api/remove-user-friend', AccountFriends.removeFriend)
    // person chat
    this.router.get('/api/list-chat/:id', AccountChat.getListChat)
  }
}

const routes = new Routes()
export default routes.router