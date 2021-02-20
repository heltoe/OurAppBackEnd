import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { errorFeedBack } from '../../FeedBack'
import { usersTable, usersInfoTable } from '../../models/Tables'
import TokenCreator, { Tokens } from '../../token-creator/tokenCreator'

const template = {
  title: 'Our App',
  body: 'Thank you for registration in Our App'
}
class Registration {
  public async registration(req: Request, res: Response) {
    try {
      const email: string = req.body.email
      const password: string = req.body.password
      const first_name: string = req.body.first_name
      const last_name: string = req.body.last_name
      const gender: string = req.body.gender
      const birth_date: string = req.body.birth_date
      const phone: string = req.body.phone
      if (
        !email ||
        !email.length ||
        !password ||
        !password.length ||
        !first_name ||
        !first_name.length ||
        !last_name ||
        !last_name.length ||
        !gender ||
        !gender.length ||
        !birth_date ||
        !birth_date.length ||
        !phone ||
        !phone.length
      ) throw new Error(errorFeedBack.requiredFields)
      const hash: string = bcrypt.hashSync(password, 10)
      const user = await usersTable.createEssence({
        email,
        password: hash,
        repassword: '',
        role: 'user'
      })
      await usersInfoTable.createEssence({
        user_id: user.id,
        first_name,
        last_name,
        gender,
        birth_date,
        phone
      })
      const tokens: Tokens | null = await TokenCreator.updateTokens(user.id)
      // запись токенов и случай когда выпадет ошибка 1 раз
      if (!tokens) throw new Error(errorFeedBack.tokens.invalid)
      // await nodeMailer.sendTo(email, template)
      return res.status(201).json(tokens)
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const registration = new Registration()
export default registration
