import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import settings from "../../settings"
import { errorFeedBack } from '../../FeedBack'
import { usersInfoTable, tables } from '../../mongo-models/Tables'

type RemoveAccountTypeParams = {
  token: string
  userId: number
}
class AccountInfo {
  public async getPersonInfo(req: Request, res: Response) {
    try {
      const user_id: string = req.params.id
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const accountInfo = await usersInfoTable.getEssence({ user_id: parseInt(user_id) })
      return res.status(200).json({ result: accountInfo })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async updatePersonInfo(req: Request, res: Response) {
    try {
      // status,
      // photo 
      const { user_id, first_name, last_name, gender, birth_date, phone } = req.body
      if (!user_id) throw new Error(errorFeedBack.requiredFields)
      const data: Object = {}
      const isExistField = (payload: Object) => {
        Object.keys(payload).forEach(item => {
          // @ts-ignore
          if (payload[item] && payload[item].length) data[item] = payload[item]
        })
      }
      isExistField({ first_name, last_name, gender, birth_date, phone })
      if (!Object.keys(data).length) throw new Error(errorFeedBack.requiredFields)
      const user_info = await usersInfoTable.updateEssence({ user_id }, data)
      return res.status(201).json({ result: user_info })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeAccount(req: Request, res: Response) {
    try {
      const { token, user_id } = req.body
      if (!token && !token.length && !user_id) throw new Error(errorFeedBack.requiredFields)
      const payload = await jwt.verify(token, settings.JWT.secret) as any
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