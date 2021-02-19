import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { errorFeedBack } from '../../FeedBack'
// import User from '../../mongo-models/User'
import TokenCreator, { Tokens } from '../../token-creator/tokenCreator'
import { ErrorResponse } from '../../router'

class Login {
  public async login(req: Request, res: Response) {
    try {
      // const email: string = req.body.email
      // const password: string = req.body.password
      // if (!email.length || !password.length) throw new Error(errorFeedBack.requiredFields)
      // const isContain = await User.findOne({ email })
      // if (!isContain) throw new Error(errorFeedBack.enterToApp.validPassword)
      // // случай когда был ли введен repassword
      // if (isContain.repassword?.length) {
      //   const isValidRePassword: boolean = bcrypt.compareSync(password, isContain.repassword)
      //   const hash: string = bcrypt.hashSync(password, 10)
      //   if (!isValidRePassword) throw new Error(errorFeedBack.enterToApp.validPassword)
      //   await User.updateOne({ email }, { password: hash, repassword: '' })
      // } else {
      //   const isValidPassword: boolean = bcrypt.compareSync(password, isContain.password)
      //   if (!isValidPassword) throw new Error(errorFeedBack.enterToApp.validPassword)
      //   await User.updateOne({ email }, { repassword: '' })
      // }
      // // запись токенов и случай когда выпадет ошибка 1 раз
      // let tokens: Tokens | null = await TokenCreator.updateTokens(isContain.id)
      // if (!tokens) {
      //   tokens = await TokenCreator.updateTokens(isContain.id)
      //   if (!tokens) throw new Error(errorFeedBack.tokens.invalid)
      // }
      // return res.status(200).json(tokens)
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const login = new Login()
export default login
