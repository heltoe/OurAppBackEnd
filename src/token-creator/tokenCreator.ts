import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import settings from "../settings"
import { errorFeedBack } from '../FeedBack'
import { usersTokenTable, usersTable, usersInfoTable } from '../models/Tables'
import { Token, User, UserInfo } from '../models/Types'

export type Tokens = {
  access_token: string
  refresh_token: string
}
export type RefreshToken = {
  id: string
  token: string
}
export type TokenGenerator = {
  user_id: number
  type: string
  iat: number
  exp: number
}

class TokenCreator {
  public generateAccessToken(user_id: number) {
    const payload: { user_id: number, type: string } = {
      user_id,
      type: settings.JWT.access.type
    }
    const options = { expiresIn: settings.JWT.access.expiresIn }
    return jwt.sign(payload, settings.JWT.secret, options)
  }
  public generateRefreshToken() {
    const payload: { id: string, type: string } = {
      id: uuidv4(),
      type: settings.JWT.refresh.type
    }
    const options = { expiresIn: settings.JWT.refresh.expiresIn }
    return {
      id: payload.id!,
      token: jwt.sign(payload, settings.JWT.secret, options)
    }
  }
  public async updateTokens(user_id: number) {
    try {
      const access_token: string = this.generateAccessToken(user_id)
      const refresh_token: RefreshToken = this.generateRefreshToken()
      await this.replaceDbRefreshToken({ user_id, token_id: refresh_token.id })
      return {
        access_token,
        refresh_token: refresh_token.token
      }
    } catch(e) {
      console.log('updateTokens', e)
      return null
    }
  }
  public async replaceDbRefreshToken({ user_id, token_id }: { user_id: number, token_id: string }) {
    try {
      this.removeToken(user_id)
      await usersTokenTable.createEssence({ user_id, token_id })
    } catch(e) {
      console.log('replaceDbRefreshToken', e)
    }
  }
  public async removeToken(user_id: number): Promise<void> {
    try {
      await usersTokenTable.deleteEssence({ user_id })
    } catch(e) {
      console.log('removeToken', e)
    }
  }
  public async getUserIdByToken(req: Request, res: Response) {
    try {
      const token: string = req.body.token
      if (!token && !token.length) throw new Error(errorFeedBack.requiredFields)
      const { user_id } = await jwt.verify(req.body.token, settings.JWT.secret) as TokenGenerator
      const userInfo: UserInfo = await usersInfoTable.getEssence({ user_id })
      const user: User = await usersTable.getEssence({ id: user_id })
      return res.status(200).json({
        id: userInfo.user_id,
        email: user.email,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        gender: userInfo.gender,
        birth_date: userInfo.birth_date,
        phone: userInfo.phone,
        original_photo: userInfo.original_photo,
        croped_photo: userInfo.croped_photo,
      })
    } catch(e) {
      return res.status(401).json({ message: e.message })
    }
  }
  public async refreshTokens(req: Request, res: Response) {
    let payload: any
    // проверка refresh-token
    try {
      const refreshToken: string = req.body.refreshToken
      payload = await jwt.verify(refreshToken, settings.JWT.secret) as TokenGenerator
      if (payload.type !== 'refresh') return res.status(401).json({ message: errorFeedBack.tokens.invalid })
    } catch(e) {
      if (e instanceof jwt.TokenExpiredError) return res.status(401).json({ message: errorFeedBack.tokens.expired })
      if (e instanceof jwt.JsonWebTokenError) return res.status(401).json({ message: errorFeedBack.tokens.invalid })
    }
    // перезапись токенов
    try {
      const token: Token = await usersTokenTable.getEssence({ token_id: payload.id })
      if (token === null) throw new Error(errorFeedBack.tokens.invalid)
      const tokens: Tokens | null = await this.updateTokens(token.user_id)
      return res.status(200).json(tokens)
    } catch(e) {
      return res.status(401).json({ message: e.message })
    }
  }
}

const tokenCreator = new TokenCreator()
export default tokenCreator
