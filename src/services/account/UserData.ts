import { Request, Response } from 'express'
import { ExtractDoc } from 'ts-mongoose'
import { errorFeedBack, successFeedBack } from '../../FeedBack'
import UserData, { UserDataSchema } from '../../mongo-models/UserData'
import User, { UserSchema } from '../../mongo-models/User'

type DataUser = {
  firstName: string
  lastName: string
  birthDate: string
  birthPlace: string
  gender: 'male' | 'female'
  status: string
  maritalStatus: number
  photo: string
}

class UserInfo {
  public async getUserData(req: Request, res: Response): Promise<Response<string>> {
    try {
      const userId: string = req.params.id
      const userData: ExtractDoc<typeof UserDataSchema> | null = await UserData.findOne({ userId })
      if (userData) throw new Error(errorFeedBack.userData.empty)
      return res.status(201).json({ data: userData })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async createUserData(req: Request, res: Response): Promise<Response<string>> {
    try {
      const userId: string = req.params.id
      if (!userId.length) throw new Error(errorFeedBack.requiredFields)
      const {
        firstName,
        lastName,
        birthDate,
        birthPlace,
        gender,
        status,
        maritalStatus,
        photo 
      } = req.body as DataUser
      if (
        !firstName.length
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
      const userData: ExtractDoc<typeof UserDataSchema> | null = await UserData.findOne({ userId })
      if (userData) throw new Error(errorFeedBack.userData.exist)
      await UserData.create({
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
  public async updateUserData(req: Request, res: Response): Promise<Response<string>> {
    try {
      const userId: string = req.params.id
      const {
        firstName,
        lastName,
        birthDate,
        birthPlace,
        gender,
        status,
        maritalStatus,
        photo 
      } = req.body as DataUser
      if (
        !firstName.length
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
      const userData: ExtractDoc<typeof UserDataSchema> | null = await UserData.findOne({ userId })
      if (!userData) throw new Error(errorFeedBack.userData.empty)
      await UserData.updateOne(
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
const userInfo = new UserInfo()
export default userInfo