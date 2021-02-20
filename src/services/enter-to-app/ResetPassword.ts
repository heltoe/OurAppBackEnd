import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { errorFeedBack } from '../../FeedBack'
import { usersTable } from '../../models/Tables'
import nodeMailer from '../../send-mailer/send-to-mail'

class ResetPassword {
  public async resetPassword(req: Request, res: Response) {
    try {
      const email: string = req.body.email
      const password: string = req.body.password
      if (!email.length || !password.length) throw new Error(errorFeedBack.requiredFields)
      const hash: string = bcrypt.hashSync(password, 10)
      await usersTable.updateEssence({ email }, { repassword: hash })
      // const template = {
      //   title: 'Our App',
      //   body: `Do you reset password in Our App: ${password}?`
      // }
      // await nodeMailer.sendTo(email, template)
      res.status(200).json({ status: 'ok' })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const resetPassword = new ResetPassword()
export default resetPassword
