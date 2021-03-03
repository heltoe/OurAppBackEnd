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
    this.router.put('/api/update-user-data', AccountInfo.updatePersonInfo)
    this.router.put('/api/change-password', AccountInfo.changePassword)
    this.router.put('/api/change-avatar', AccountInfo.changeAvatar)
    this.router.delete('/api/remove-account', AccountInfo.removeAccount)
    // person friendShip
    this.router.get('/api/list-friendship/:id', AccountFriends.getFriendShipList)
    this.router.put('/api/add-to-friendship', AccountFriends.addToFriendShip.bind(AccountFriends))
    this.router.delete('/api/remove-from-friendship', AccountFriends.removeFromFriendShip.bind(AccountFriends))
    // person friends
    this.router.get('/api/user-list/:id', AccountFriends.getUserList)
    this.router.get('/api/user-friends/:id', AccountFriends.getFriends)
    this.router.put('/api/add-to-friend', AccountFriends.addToFriend.bind(AccountFriends))
    this.router.delete('/api/remove-from-friend', AccountFriends.removeFromFriend.bind(AccountFriends))
    // person chat
    this.router.get('/api/list-chat/:id', AccountChat.getListChat)
  }
}

const routes = new Routes()
export default routes.router