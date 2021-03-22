import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import settings from "../../settings"
import { errorFeedBack } from '../../FeedBack'
import { tables } from '../../models/Tables'
import { User, UserInfo } from '../../models/Types'
import { TokenGenerator } from '../../token-creator/tokenCreator'
import Uploader from '../../save-assets/Uploader'

class AccountInfo {
  public async getPersonInfo(req: Request, res: Response) {
    try {
      const user_id: string = req.params.id
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const accountInfo: UserInfo = await tables.info.getEssence({ user_id: parseInt(user_id) })
      return res.status(200).json({ result: accountInfo })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async updatePersonInfo(req: Request, res: Response) {
    try {
      const { token, user_id, password }: { token: string, user_id: number, password: number } = req.body
      if (!token && !user_id && !password) throw new Error(errorFeedBack.requiredFields)
      const payload = await jwt.verify(token, settings.JWT.secret) as TokenGenerator
      if (payload.user_id !== user_id) throw new Error(errorFeedBack.userData.empty)
      const data: {
        first_name?: string,
        last_name?: string,
        birth_date?: Date,
        phone?: string
      } = {}
      if (req.body.first_name) data.first_name = req.body.first_name
      if (req.body.last_name) data.last_name = req.body.last_name
      if (req.body.birth_date) data.birth_date = req.body.birth_date
      if (req.body.phone) data.phone = req.body.phone
      if (Object.keys(data).length || req.body.email) {
        const user_info: UserInfo | User = Object.keys(data).length
          ? await tables.info.updateEssence({ user_id }, data)
          : await tables.user.updateEssence({ id: user_id }, { email: req.body.email })
        const user: User = await tables.user.getEssence({ id: user_id })
        return res.status(201).json({ ...user_info, email: user.email })
      }
      throw new Error(errorFeedBack.requiredFields)
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async changeAvatar(req: Request, res: Response) {
    try {
      const { token, user_id }: { token: string, user_id: string } = req.body
      if (!token && !user_id) throw new Error(errorFeedBack.requiredFields)
      if (!req.files.length) throw new Error(errorFeedBack.requiredFields)
      const payload = await jwt.verify(token, settings.JWT.secret) as TokenGenerator
      if (payload.user_id !== parseInt(user_id)) throw new Error(errorFeedBack.userData.empty)
      // @ts-ignore
      const original_file = req.files.find(item => item.fieldname === 'original_photo')
      // @ts-ignore
      const croped_file = req.files.find(item => item.fieldname === 'croped_photo')
      if (!original_file || !original_file) throw new Error(errorFeedBack.requiredFields)
      const original_photo = await Uploader.uploadFile(original_file, req.body.original_photo_name || '')
      const croped_photo = await Uploader.uploadFile(croped_file, req.body.croped_photo_name || '')
      await tables.info.updateEssence({ user_id: parseInt(user_id) }, { original_photo, croped_photo })
      return res.status(200).json({ original_photo, croped_photo })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async changePassword(req: Request, res: Response) {
    try {
      const { token, user_id, password }: { token: string, user_id: number, password: number } = req.body
      if (!token && !user_id && !password) throw new Error(errorFeedBack.requiredFields)
      const payload = await jwt.verify(token, settings.JWT.secret) as TokenGenerator
      if (payload.user_id !== user_id) throw new Error(errorFeedBack.userData.empty)
      await tables.user.updateEssence({ id: user_id }, { password: bcrypt.hashSync(password, 10) })
      return res.status(200).json({ status: 'ok' })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeAccount(req: Request, res: Response) {
    try {
      const { token, user_id }: { token: string, user_id: number } = req.body
      if (!token && !user_id) throw new Error(errorFeedBack.requiredFields)
      const payload = await jwt.verify(token, settings.JWT.secret) as TokenGenerator
      if (payload.user_id === user_id) {
        // @ts-ignore
        const requests: any = Object.keys(tables).map(item => requests.push(tables[item].deleteEssence(item === 'user' ? { id: user_id } : { user_id })))
        await Promise.all(requests)
      }
      return res.status(200).json({ status: 'ok' })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountInfo = new AccountInfo()
export default accountInfo