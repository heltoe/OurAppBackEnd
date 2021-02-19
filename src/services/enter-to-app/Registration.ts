import { Request, Response } from 'express'
// @ts-ignore
import generateUniqueId from 'generate-unique-id'
import bcrypt from 'bcrypt'
import { errorFeedBack } from '../../FeedBack'
import Chats from '../../mongo-models/message/Chats'
import TokenCreator, { Tokens } from '../../token-creator/tokenCreator'
import { ErrorResponse } from '../../router'
import { CommonEssence } from '../../mongo-models/CommonEssence'
import adapterDBConnector from '../../adapter-db-connector'

const template = {
  title: 'Our App',
  body: 'Thank you for registration in Our App'
}
class Registration {
  // Promise<Response<Tokens | ErrorResponse>>
  public async registration(req: Request, res: Response) {
    try {
      const email: string = req.body.email
      const password: string = req.body.password
      const firstName: string = req.body.firstName
      const lastName: string = req.body.lastName
      const gender: string = req.body.gender
      const birthDate: string = req.body.birthDate
      if (
        !email ||
        !email.length
        // !password ||
        // !password.length
        // !firstName ||
        // !firstName.length ||
        // !lastName ||
        // !lastName.length ||
        // !gender ||
        // !gender.length ||
        // !birthDate ||
        // !birthDate.length
      ) throw new Error(errorFeedBack.requiredFields)
      const registrationModel = new CommonEssence('users')
      // const hash: string = bcrypt.hashSync(password, 10)
      const user = await adapterDBConnector.getDb().query(`INSERT INTO users (id, email) values ($1, $2) RETURNING *`, [generateUniqueId({ length: 20, useLetters: false, useNumbers: true }), email, ''])
      // const user = await registrationModel.createEssence({
      //   id: generateUniqueId({ length: 20, useLetters: false, useNumbers: true }),
      //   email,
      //   // password: hash,
      //   repassword: ''
      // })
      // await UserInfo.create({
      //   userId: user.id,
      //   firstName,
      //   lastName,
      //   birthDate,
      //   gender
      // })
      // тянем создание пустого массива друзей
      // await Friends.create({ userId: user.id, friends: [] })
      // тянем создание пустого массива сообщений
      // await Chats.create({ userId: user.id, messages: [] })
      // Тянем создание пустого массива заявок в друзья
      // await FriendShip.create({ userId: user.id, friendShip: [] })
      // запись токенов и случай когда выпадет ошибка 1 раз
      // let tokens: Tokens | null = await TokenCreator.updateTokens(user.id)
      // if (!tokens) {
      //   tokens = await TokenCreator.updateTokens(user.id)
      //   if (!tokens) throw new Error(errorFeedBack.tokens.invalid)
      // }
      // await nodeMailer.sendTo(email, template)
      // return res.status(201).json(tokens)
      return res.status(201).json(user)
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const registration = new Registration()
export default registration
