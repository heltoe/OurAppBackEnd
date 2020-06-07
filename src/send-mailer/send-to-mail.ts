import nodemailer from 'nodemailer'
import settings from '../settings'

export type MessageToMail = {
  title: string
  body: string
}

class SendEmail {
  async sendTo(addr: string, message: MessageToMail) {
    try {
      const smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        service: 'gmail',
        auth: {
          user: settings.SMTP.email,
          pass: settings.SMTP.password
        }
      })
      await smtpTransport.sendMail({
        to: addr,
        from: settings.SMTP.email,
        subject: message.title,
        html: message.body
      })
    } catch(error) {
      console.log(error)
      throw new Error(error)
    }
  }
}

const sendler = new SendEmail()
export default sendler