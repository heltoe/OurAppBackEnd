import { Request, Response } from 'express'
import { ExtractDoc } from 'ts-mongoose'
import { errorFeedBack, successFeedBack } from '../../FeedBack'
import UserInfo, { UserInfoSchema, DataUserInfo } from '../../mongo-models/UserInfo'
import User, { UserSchema } from '../../mongo-models/User'

class AccountInfo {
  public async getPersonInfo(req: Request, res: Response): Promise<Response<string>> {
    try {
      const userId: string = req.params.id
      const accountInfo: ExtractDoc<typeof UserInfoSchema> | null = await UserInfo.findOne({ userId })
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
        birthDate,
        birthPlace,
        gender,
        status,
        maritalStatus,
        photo 
      } = req.body as DataUserInfo
      if (
        !userId.length
        || !firstName.length
        || !lastName.length
        || !birthDate.length
        || !birthPlace.length
        || !gender.length
        || !status.length
        || !maritalStatus
        || !photo.length
      ) throw new Error(errorFeedBack.requiredFields)
      const isContain: ExtractDoc<typeof UserSchema> | null = await User.findOne({ _id: userId })
      if (!isContain) throw new Error(errorFeedBack.userData.empty)
      const accountInfo: ExtractDoc<typeof UserInfoSchema> | null = await UserInfo.findOne({ userId })
      if (accountInfo) throw new Error(errorFeedBack.userData.exist)
      await UserInfo.create({
        userId,
        firstName,
        lastName,
        birthDate,
        birthPlace,
        gender,
        status,
        maritalStatus,
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
        birthDate,
        birthPlace,
        gender,
        status,
        maritalStatus,
        photo 
      } = req.body as DataUserInfo
      if (
        !userId.length
        || !firstName.length
        || !lastName.length
        || !birthDate.length
        || !birthPlace.length
        || !gender.length
        || !status.length
        || !maritalStatus
        || !photo.length
      ) throw new Error(errorFeedBack.requiredFields)
      const isContain: ExtractDoc<typeof UserSchema> | null = await User.findOne({ _id: userId })
      if (!isContain) throw new Error(errorFeedBack.enterToApp.emptyUser)
      const accountInfo: ExtractDoc<typeof UserInfoSchema> | null = await UserInfo.findOne({ userId })
      if (!accountInfo) throw new Error(errorFeedBack.userData.empty)
      await UserInfo.updateOne(
        { userId },
        {
          firstName,
          lastName,
          birthDate,
          birthPlace,
          gender,
          status,
          maritalStatus,
          photo
        })
      return res.status(200).json({ status: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountInfo = new AccountInfo()
export default accountInfo