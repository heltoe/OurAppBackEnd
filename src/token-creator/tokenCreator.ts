import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import settings from "../settings"
import Token from '../mongo-models/Token'
import { errorFeedBack } from '../FeedBack'
import { ErrorResponse } from '../router'

export type Token = {
  id?: string
  userId?: string
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
  public generateAccessToken(userId: string): string {
    const payload: Token = {
      userId,
      type: settings.JWT.access.type
    }
    const options = { expiresIn: settings.JWT.access.expiresIn }
    return jwt.sign(payload, settings.JWT.secret, options)
  }
  public generateRefreshToken(): RefreshToken {
    const payload: Token = {
      id: uuidv4(),
      type: settings.JWT.refresh.type
    }
    const options = { expiresIn: settings.JWT.refresh.expiresIn }
    return {
      id: payload.id!,
      token: jwt.sign(payload, settings.JWT.secret, options)
    }
  }
  public async updateTokens(userId: string): Promise<Tokens | null> {
    try {
      const accessToken: string = this.generateAccessToken(userId)
      const refreshToken: RefreshToken = this.generateRefreshToken()
      await this.replaceDbRefreshToken(refreshToken.id, userId)
      return {
        accessToken,
        refreshToken: refreshToken.token
      }
    } catch(e) {
      console.log('updateTokens', e)
      return null
    }
  }
  public async replaceDbRefreshToken(tokenId: string, userId: string): Promise<void> {
    try {
      this.removeToken(userId)
      await Token.create({ tokenId, userId })
    } catch(e) {
      console.log('replaceDbRefreshToken', e)
    }
  }
  public async removeToken(userId: string): Promise<void> {
    try {
      await Token.findOneAndDelete({ userId })
    } catch(e) {
      console.log('removeToken', e)
    }
  }
  public async refreshTokens(req: Request, res: Response): Promise<Response<Tokens | ErrorResponse>> {
    let payload: any
    // проверка refresh-token
    try {
      const refreshToken: string = req.body.refreshToken
      payload = await jwt.verify(refreshToken, settings.JWT.secret) as Token
      if (payload.type !== 'refresh') return res.status(401).json({ message: errorFeedBack.tokens.invalid })
    } catch(e) {
      if (e instanceof jwt.TokenExpiredError) return res.status(401).json({ message: errorFeedBack.tokens.expired })
      if (e instanceof jwt.JsonWebTokenError) return res.status(401).json({ message: errorFeedBack.tokens.invalid })
    }
    // перезапись токенов
    try {
      const token = await Token.findOne({ tokenId: payload.id })
      if (token === null) throw new Error(errorFeedBack.tokens.invalid)
      const tokens: Tokens | null = await this.updateTokens(token.userId)
      return res.status(200).json(tokens)
    } catch(e) {
      return res.status(401).json({ message: e.message })
    }
  }
}

const tokenCreator = new TokenCreator()
export default tokenCreator
