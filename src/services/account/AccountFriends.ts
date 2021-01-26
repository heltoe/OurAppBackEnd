import { Request, Response } from 'express'
import { ExtractDoc } from 'ts-mongoose'
import { errorFeedBack, successFeedBack } from '../../FeedBack'
import Friends, { UserFriendsSchema } from '../../mongo-models/Friends'
import UserInfo, { UserInfoSchema } from '../../mongo-models/UserInfo'

class AccountFriends {
  public async getFriends(req: Request, res: Response) {
    try {
      let friends: ExtractDoc<typeof UserInfoSchema>[] = []
      const userId: string = req.params.id
      const accountFriends: ExtractDoc<typeof UserFriendsSchema> | null = await Friends.findOne({ userId })
      if (!accountFriends) throw new Error(errorFeedBack.userData.empty)
      if (accountFriends.friends.length) {
        const requests: any = []
        accountFriends.friends.forEach(idFriend => {
          requests.push(UserInfo.findOne({ userId: idFriend }))
        })
        friends = await Promise.all(requests)
      }
      return res.status(201).json({ data: friends })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async createFriend(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      if (!userId.length || !friendId.length) throw new Error(errorFeedBack.userData.empty)
      const accountFriends: ExtractDoc<typeof UserFriendsSchema> | null = await Friends.findOne({ userId })
      if (!accountFriends) throw new Error(errorFeedBack.userData.empty)
      const id: number = accountFriends.friends.findIndex((item: string): boolean => item === friendId)
      if (id !== -1) throw new Error(errorFeedBack.friends.exist)
      await Friends.updateOne({ userId }, { friends: [...accountFriends.friends, friendId] })
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeFriend(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      if (!userId.length || !friendId.length) throw new Error(errorFeedBack.userData.empty)
      const accountFriends: ExtractDoc<typeof UserFriendsSchema> | null = await Friends.findOne({ userId })
      if (!accountFriends) throw new Error(errorFeedBack.userData.empty)
      if (!accountFriends.friends.length) throw new Error(errorFeedBack.friends.empty)
      const changedFriends: string[]  = accountFriends.friends.filter((item: string): boolean => item !== friendId)
      await Friends.updateOne({ userId }, { friends: changedFriends })
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountFriends = new AccountFriends()
export default accountFriends