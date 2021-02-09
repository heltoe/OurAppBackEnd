import { Request, Response } from 'express'
import { ExtractDoc } from 'ts-mongoose'
import Friends from '../../mongo-models/Friends'
import UserInfo, { UserInfoSchema } from '../../mongo-models/UserInfo'
import FriendShip from '../../mongo-models/FriendShip'
import { errorFeedBack, successFeedBack } from '../../FeedBack'

class AccountFriends {
  public async getUserList(req: Request, res: Response) {
    try {
      const userId: string = req.params.userId
      if (!userId && !userId.length) throw new Error(errorFeedBack.requiredFields)
      const usersInfo = await UserInfo.find()
      if (!usersInfo) throw new Error(errorFeedBack.enterToApp.validPassword)
      const parsedUsers = usersInfo.filter(item => item.userId !== parseInt(userId)).map(item => ({
        id: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        image: item.photo,
        gender: item.gender,
        birthDate: item.birthDate
      }))
      return res.status(200).json({ users: parsedUsers })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getFriends(req: Request, res: Response) {
    try {
      const userId: string = req.params.userId
      if (!userId && !userId.length) throw new Error(errorFeedBack.requiredFields)
      const accountFriends = await Friends.findOne({ userId: parseInt(userId) })
      if (!accountFriends) throw new Error(errorFeedBack.userData.empty)
      let friends: ExtractDoc<typeof UserInfoSchema>[] = []
      // вытягиваем актуальную информацию об аккаунтах по их id
      if (accountFriends.friends.length) {
        const requests: any = []
        accountFriends.friends.forEach(idFriend => {
          requests.push(UserInfo.findOne({ userId: idFriend }))
        })
        friends = await Promise.all(requests)
      }
      const parsedFriends = friends.map(item => ({
        id: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        photo: item.photo,
        gender: item.gender,
        birthDate: item.birthDate,
        location: item.location,
        status: item.status,
      }))
      return res.status(201).json({ friends: parsedFriends })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getFriendShipList(req: Request, res: Response) {
    try {
      const userId: string = req.params.userId
      if (!userId && !userId.length) throw new Error(errorFeedBack.requiredFields)
      const friendShipUser = await FriendShip.findOne({ userId: parseInt(userId) })
      if (!friendShipUser) throw new Error(errorFeedBack.userData.empty)
      let friendShipList: ExtractDoc<typeof UserInfoSchema>[] = []
      // вытягиваем актуальную информацию об аккаунтах по их id
      if (friendShipUser.friendShip && friendShipUser.friendShip.length) {
        const requests: any = []
        friendShipUser.friendShip.forEach(idFriendShip => {
          requests.push(UserInfo.findOne({ userId: idFriendShip }))
        })
        friendShipList = await Promise.all(requests)
      }
      const parsedFriendShipList = friendShipList.map(item => ({
        id: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        photo: item.photo,
        gender: item.gender,
        birthDate: item.birthDate,
        location: item.location,
        status: item.status,
      }))
      return res.status(201).json({ users: parsedFriendShipList })
    } catch (e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async addToFriendShip(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      const friendShipUser = await FriendShip.findOne({ userId })
      if (!friendShipUser) throw new Error(errorFeedBack.userData.empty)
      const id: number = friendShipUser.friendShip.findIndex((item: number): boolean => item === friendId)
      if (id !== -1) throw new Error(errorFeedBack.friendship.exist)
      await FriendShip.updateOne({ userId }, { friends: [...friendShipUser.friendShip, friendId] })
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeFromFriendShip(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      const friendShipUser = await FriendShip.findOne({ userId })
      if (!friendShipUser) throw new Error(errorFeedBack.userData.empty)
      const id: number = friendShipUser.friendShip.findIndex((item: number): boolean => item === friendId)
      if (id > -1) throw new Error(errorFeedBack.friendship.exist)
      await FriendShip.updateOne({ userId }, { friendShip: friendShipUser.friendShip.filter(item => item !== friendId) })
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async createFriend(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      const accountFriends = await Friends.findOne({ userId })
      if (!accountFriends) throw new Error(errorFeedBack.userData.empty)
      const id: number = accountFriends.friends.findIndex((item: number): boolean => item === friendId)
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
      if (userId || !friendId) throw new Error(errorFeedBack.userData.empty)
      const accountFriends = await Friends.findOne({ userId })
      if (!accountFriends) throw new Error(errorFeedBack.userData.empty)
      if (!accountFriends.friends.length) throw new Error(errorFeedBack.friends.empty)
      await Friends.updateOne({ userId }, { friends: accountFriends.friends.filter(item => item !== friendId) })
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountFriends = new AccountFriends()
export default accountFriends