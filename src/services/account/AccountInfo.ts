import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import settings from "../../settings"
import { errorFeedBack, successFeedBack } from '../../FeedBack'
import UserInfo, { DataUserInfo } from '../../mongo-models/UserInfo'
import User from '../../mongo-models/User'
import Chats from '../../mongo-models/message/Chats'
import Friends from '../../mongo-models/Friends'
import Token from '../../mongo-models/Token'

type RemoveAccountTypeParams = {
  token: string
  id: string
}
class AccountInfo {
  public async getPersonInfo(req: Request, res: Response): Promise<Response<string>> {
    try {
      const userId: string = req.params.id
      if (!userId && !userId.length) throw new Error(errorFeedBack.requiredFields)
      const accountInfo = await UserInfo.findOne({ userId: parseInt(userId) })
      if (accountInfo) throw new Error(errorFeedBack.userData.empty)
      return res.status(201).json({ data: accountInfo })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async createPersonInfo(req: Request, res: Response): Promise<Response<string>> {
    try {
      const {
        userId,
        firstName,
        lastName,
        gender,
        status,
        photo 
      } = req.body as DataUserInfo
      if (
        !userId
        && !firstName.length
        && !lastName.length
        && !gender.length
        && !status.length
        && !photo.length
      ) throw new Error(errorFeedBack.requiredFields)
      const isContain = await User.findOne({ id: userId })
      if (!isContain) throw new Error(errorFeedBack.userData.empty)
      const accountInfo = await UserInfo.findOne({ userId })
      if (accountInfo) throw new Error(errorFeedBack.userData.exist)
      await UserInfo.create({
        userId,
        firstName,
        lastName,
        gender,
        status,
        photo 
      })
      return res.status(200).json({ status: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async updatePersonInfo(req: Request, res: Response): Promise<Response<string>> {
    try {
      const {
        userId,
        firstName,
        lastName,
        gender,
        status,
        photo 
      } = req.body as DataUserInfo
      if (
        !userId
        && !firstName.length
        && !lastName.length
        && !gender.length
        && !status.length
        && !photo.length
      ) throw new Error(errorFeedBack.requiredFields)
      const isContain = await User.findOne({ id: userId })
      if (!isContain) throw new Error(errorFeedBack.enterToApp.emptyUser)
      const accountInfo = await UserInfo.findOne({ userId })
      if (!accountInfo) throw new Error(errorFeedBack.userData.empty)
      await UserInfo.updateOne(
        { userId },
        {
          firstName,
          lastName,
          gender,
          status,
          photo
        })
      return res.status(200).json({ status: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeAccount(req: Request, res: Response) {
    try {
      const { token, id } = req.body as RemoveAccountTypeParams
      if (!token && !token.length && !id) throw new Error(errorFeedBack.requiredFields)
      const payload = await jwt.verify(token, settings.JWT.secret) as any
      if (payload.userId === id) {
        await User.findOneAndRemove({ id })
        await Friends.findOneAndRemove({ id })
        await Chats.findOneAndRemove({ id })
      }
      return res.status(200).json({ status: 'ok' })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountInfo = new AccountInfo()
export default accountInfo