import { Request, Response } from 'express'
import TokenCreator, { Tokens } from '../../token-creator/tokenCreator'
import { errorFeedBack, successFeedBack } from '../../FeedBack'
import { ErrorResponse } from '../../router'

class Logout {
  public async logout(req: Request, res: Response): Promise<Response<ErrorResponse>> {
    try {
      const user_id: number = req.body.user_id
      await TokenCreator.removeToken(user_id)
      return res.status(200).json({ status: successFeedBack.enterToApp.logout })
    } catch(e) {
      return res.status(404).json({ status: errorFeedBack.enterToApp.logout })
    }
  }
}
const logout = new Logout()
export default logout
