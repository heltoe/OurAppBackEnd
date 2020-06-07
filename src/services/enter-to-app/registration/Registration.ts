import { Request, Response } from 'express'
import { ExtractDoc } from 'ts-mongoose'
import bcrypt from 'bcrypt'
import { errorFeedBack } from '../../../FeedBack'
import User, { UserSchema } from '../../../mongo-models/User'
import TokenCreator, { Tokens } from '../../../token-creator/tokenCreator'
import { ErrorResponse } from '../../../router'
import nodeMailer from '../../../send-mailer/send-to-mail'

class Registration {
  public async registration(req: Request, res: Response): Promise<Response<Tokens | ErrorResponse>> {
    try {
      const email: string = req.body.email
      const password: string = req.body.password
      if (!email.length || !password.length) throw new Error(errorFeedBack.requiredFields)
      const isContain: ExtractDoc<typeof UserSchema> | null = await User.findOne({ email })
      if (isContain) throw new Error(errorFeedBack.enterToApp.existUser)
      const hash: string = bcrypt.hashSync(password, 10)
      const user: ExtractDoc<typeof UserSchema> = await User.create({ email, password: hash })
      // запись токенов и случай когда выпадет ошибка 1 раз
      let tokens: Tokens | null = await TokenCreator.updateTokens(user._id)
      if (!tokens) {
        tokens = await TokenCreator.updateTokens(user._id)
        if (!tokens) throw new Error(errorFeedBack.tokens.invalid)
      }
      const template = {
        title: 'Our App',
        body: 'Thank you for registration in Our App'
      }
      await nodeMailer.sendTo(email, template)
      return res.status(201).json(tokens)
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const registration = new Registration()
export default registration
