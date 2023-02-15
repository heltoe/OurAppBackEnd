import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import settings from '../settings'
import { TokenGenerator } from '../token-creator/tokenCreator'
import { errorFeedBack } from '../FeedBack'

export default function(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader: string | undefined = req.get('Authorization')
    if (!authHeader) return res.status(401).json({ message: errorFeedBack.tokens.provided })
    const token: string = authHeader.replace('Bearer ', '')
    const payload = jwt.verify(token, settings.JWT.secret) as TokenGenerator
    if (payload.type !== 'access') return res.status(401).json({ message: errorFeedBack.tokens.invalid })
  } catch(e) {
    if (e instanceof jwt.TokenExpiredError) return res.status(401).json({ message: errorFeedBack.tokens.expired })
    if (e instanceof jwt.JsonWebTokenError) return res.status(401).json({ message: errorFeedBack.tokens.invalid })
  }
  next()
}
