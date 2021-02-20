import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { usersTable } from '../../models/Tables'
import TokenCreator, { Tokens } from '../../token-creator/tokenCreator'
import { errorFeedBack } from '../../FeedBack'

class Login {
  public async login(req: Request, res: Response) {
    try {
      const email: string = req.body.email
      const password: string = req.body.password
      if (!email.length || !password.length) throw new Error(errorFeedBack.requiredFields)
      const is_contain = await usersTable.getEssence({ email })
      // случай когда был ли введен repassword
      if (is_contain.repassword) {
        const isValidRePassword: boolean = bcrypt.compareSync(password, is_contain.repassword)
        const hash: string = bcrypt.hashSync(password, 10)
        if (!isValidRePassword) throw new Error(errorFeedBack.enterToApp.validPassword)
        await usersTable.updateEssence({ email }, { password: hash, repassword: '' })
      } else {
        const isValidPassword: boolean = bcrypt.compareSync(password, is_contain.password)
        if (!isValidPassword) throw new Error(errorFeedBack.enterToApp.validPassword)
        await usersTable.updateEssence({ email }, { repassword: '' })
      }
      // запись токенов и случай когда выпадет ошибка 1 раз
      let tokens: Tokens | null = await TokenCreator.updateTokens(is_contain.id)
      if (!tokens) {
        tokens = await TokenCreator.updateTokens(is_contain.id)
        if (!tokens) throw new Error(errorFeedBack.tokens.invalid)
      }
      return res.status(200).json(tokens)
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}

const login = new Login()
export default login
