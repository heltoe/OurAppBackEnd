import { Request, Response } from 'express'
import { ExtractDoc } from 'ts-mongoose'
import bcrypt from 'bcrypt'
import { errorFeedBack } from '../../../FeedBack'
import User, { UserSchema } from '../../../mongo-models/User'
import nodeMailer from '../../../send-mailer/send-to-mail'

class ResetPassword {
  public async resetPassword(req: Request, res: Response) {
    try {
      const email: string = req.body.email
      const password: string = req.body.password
      if (!email.length || !password.length) throw new Error(errorFeedBack.requiredFields)
      const hash: string = bcrypt.hashSync(password, 10)
      const isContain: ExtractDoc<typeof UserSchema> | null = await User.findOneAndUpdate({ email }, { repassword: hash })
      if (!isContain) throw new Error(errorFeedBack.enterToApp.emptyUser)
      const template = {
        title: 'Our App',
        body: `Do you reset password in Our App: ${password}?`
      }
      await nodeMailer.sendTo(email, template)
      res.status(200).json({ res: isContain })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const resetPassword = new ResetPassword()
export default resetPassword
