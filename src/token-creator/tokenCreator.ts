import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import settings from "../settings"
// import Token from '../mongo-models/Token'
// import User from '../mongo-models/User'
// import UserInfo from '../mongo-models/UserInfo'
import { errorFeedBack } from '../FeedBack'
import { ErrorResponse } from '../router'

export type Token = {
  id?: string
  userId?: number
  type: string
}
export type Tokens = {
  accessToken: string
  refreshToken: string
}
export type RefreshToken = {
  id: string
  token: string
}

class TokenCreator {
  public generateAccessToken(userId: number) {
  //   const payload: Token = {
  //     userId,
  //     type: settings.JWT.access.type
  //   }
  //   const options = { expiresIn: settings.JWT.access.expiresIn }
  //   return jwt.sign(payload, settings.JWT.secret, options)
  }
  public generateRefreshToken() {
    // const payload: Token = {
    //   id: uuidv4(),
    //   type: settings.JWT.refresh.type
    // }
    // const options = { expiresIn: settings.JWT.refresh.expiresIn }
    // return {
    //   id: payload.id!,
    //   token: jwt.sign(payload, settings.JWT.secret, options)
    // }
  }
  public async updateTokens(userId: number) {
    try {
      // const accessToken: string = this.generateAccessToken(userId)
      // const refreshToken: RefreshToken = this.generateRefreshToken()
      // await this.replaceDbRefreshToken(refreshToken.id, userId)
      // return {
      //   accessToken,
      //   refreshToken: refreshToken.token
      // }
    } catch(e) {
      console.log('updateTokens', e)
      return null
    }
  }
  public async replaceDbRefreshToken(tokenId: string, userId: number): Promise<void> {
    try {
      // this.removeToken(userId)
      // await Token.create({ tokenId, userId })
    } catch(e) {
      console.log('replaceDbRefreshToken', e)
    }
  }
  public async removeToken(userId: number): Promise<void> {
    try {
      // await Token.findOneAndDelete({ userId })
    } catch(e) {
      console.log('removeToken', e)
    }
  }
  public async getUserIdByToken(req: Request, res: Response) {
    try {
      // const token: string = req.body.token
      // if (!token && !token.length) throw new Error(errorFeedBack.requiredFields)
      // const payload = await jwt.verify(req.body.token, settings.JWT.secret) as Token
      // const user = await User.findOne({ id: payload.userId })
      // const userInfo = await UserInfo.findOne({ userId: payload.userId })
      // if (!user || !userInfo) throw new Error(errorFeedBack.enterToApp.validPassword)
      // return res.status(200).json({
      //   id: payload.userId,
      //   email: user.email,
      //   firstName: userInfo.firstName,
      //   lastName: userInfo.lastName,
      //   birthDate: userInfo.birthDate,
      //   gender: userInfo.gender,
      //   role: user.role,
      //   location: userInfo.location,
      //   photo: userInfo.photo
      // })
    } catch(e) {
      return res.status(401).json({ message: e.message })
    }
  }
  public async refreshTokens(req: Request, res: Response) {
    let payload: any
    // проверка refresh-token
    try {
    //   const refreshToken: string = req.body.refreshToken
    //   payload = await jwt.verify(refreshToken, settings.JWT.secret) as Token
    //   if (payload.type !== 'refresh') return res.status(401).json({ message: errorFeedBack.tokens.invalid })
    // } catch(e) {
    //   if (e instanceof jwt.TokenExpiredError) return res.status(401).json({ message: errorFeedBack.tokens.expired })
    //   if (e instanceof jwt.JsonWebTokenError) return res.status(401).json({ message: errorFeedBack.tokens.invalid })
    // }
    // // перезапись токенов
    // try {
    //   const token = await Token.findOne({ tokenId: payload.id })
    //   if (token === null) throw new Error(errorFeedBack.tokens.invalid)
    //   const tokens: Tokens | null = await this.updateTokens(token.userId)
    //   return res.status(200).json(tokens)
    } catch(e) {
      return res.status(401).json({ message: e.message })
    }
  }
}

const tokenCreator = new TokenCreator()
export default tokenCreator
