import { Request, Response } from 'express'
import { ExtractDoc } from 'ts-mongoose'
import Friends from '../../mongo-models/Friends'
import UserInfo, { UserInfoSchema } from '../../mongo-models/UserInfo'
import FriendShip from '../../mongo-models/FriendShip'
import { errorFeedBack, successFeedBack } from '../../FeedBack'

class AccountFriends {
  public async getUserList(req: Request, res: Response) {
    try {
      const userId: string = req.params.id
      if (!userId && !userId.length) throw new Error(errorFeedBack.requiredFields)
      const usersInfo = await UserInfo.find()
      if (!usersInfo) throw new Error(errorFeedBack.enterToApp.validPassword)
      const friendShipUser = await FriendShip.findOne({ userId: parseInt(userId) })
      if (!friendShipUser) throw new Error(errorFeedBack.userData.empty)
      const parsedUsers = usersInfo.filter(item => item.userId !== parseInt(userId)).map(item => ({
        id: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        image: item.photo,
        gender: item.gender,
        birthDate: item.birthDate,
        calledToFriendShip: friendShipUser.friendShip!.length > 0 && friendShipUser.friendShip!.findIndex(friendShipItem => friendShipItem === item.userId) > -1
      }))
      return res.status(200).json({ users: parsedUsers })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getFriends(req: Request, res: Response) {
    try {
      const userId: string = req.params.id
      if (!userId && !userId.length) throw new Error(errorFeedBack.requiredFields)
      const accountFriends = await Friends.findOne({ userId: parseInt(userId) })
      if (!accountFriends) throw new Error(errorFeedBack.userData.empty)
      let friends: ExtractDoc<typeof UserInfoSchema>[] = []
      // вытягиваем актуальную информацию об аккаунтах по их id
      if (accountFriends.friends!.length) {
        const requests: any = []
        accountFriends.friends!.forEach(idFriend => {
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
      return res.status(200).json({ friends: parsedFriends })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getFriendShipList(req: Request, res: Response) {
    try {
      const userId: string = req.params.id
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
      return res.status(200).json({ users: parsedFriendShipList })
    } catch (e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async addToFriendShip(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      await this.addItemToFirendShip(userId, friendId)
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeFromFriendShip(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      await this.removeItemFromFirendShip(userId, friendId)
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async addToFriend(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      await this.removeItemFromFirendShip(userId, friendId)
      await this.addItemToFriend(userId, friendId)
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeFromFriend(req: Request, res: Response) {
    try {
      const { userId, friendId } = req.body
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      await this.removeItemFromFriend(userId, friendId)
      return res.status(201).json({ data: successFeedBack.common.status })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  //
  async addItemToFirendShip(userId: number, friendId: number) {
    try {
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      const friendShipUser = await FriendShip.findOne({ userId: userId })
      const friendShipNewFriend = await FriendShip.findOne({ userId: friendId })
      if (!friendShipUser || !friendShipNewFriend) throw new Error(errorFeedBack.userData.empty)
      const id: number = friendShipUser.friendShip!.findIndex((item: number): boolean => item === friendId)
      const idNewFriend: number = friendShipNewFriend.friendShip!.findIndex((item: number): boolean => item === userId)
      if (id !== -1 || idNewFriend !== -1) throw new Error(errorFeedBack.friendship.exist)
      await FriendShip.updateOne({ userId }, { friendShip: [...friendShipUser.friendShip!, friendId] })
      await FriendShip.updateOne({ userId: friendId }, { friendShip: [...friendShipUser.friendShip!, userId] })
      const test = await FriendShip.findOne({ userId })
    } catch(e) {
      throw new Error(e.message)
    }
  }
  async removeItemFromFirendShip(userId: number, friendId: number) {
    try {
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      const accountFriendShip = await FriendShip.findOne({ userId })
      const exFriendShip = await FriendShip.findOne({ userId: friendId })
      if (!accountFriendShip || !exFriendShip) throw new Error(errorFeedBack.friendship.empty)
      const idFriendShip: number = accountFriendShip.friendShip!.findIndex((item: number): boolean => item === friendId)
      const idExFriendShip: number = exFriendShip.friendShip!.findIndex((item: number): boolean => item === userId)
      if (idFriendShip === -1 || idExFriendShip === -1) throw new Error(errorFeedBack.friendship.empty)
      await FriendShip.updateOne({ userId }, { friendShip: accountFriendShip.friendShip!.filter(item => item !== friendId) })
      await FriendShip.updateOne({ userId: friendId }, { friendShip: exFriendShip.friendShip!.filter(item => item !== userId) })
    } catch(e) {
      throw new Error(e.message)
    }
  }
  async addItemToFriend(userId: number, friendId: number) {
    try {
      if (!userId || !friendId) throw new Error(errorFeedBack.requiredFields)
      const accountFriends = await Friends.findOne({ userId })
      const accountNewFriendFriends = await Friends.findOne({ userId: friendId })
      if (!accountFriends || !accountNewFriendFriends) throw new Error(errorFeedBack.userData.empty)
      const id: number = accountFriends.friends!.findIndex((item): boolean => item === friendId)
      const idNewFriend: number = accountNewFriendFriends.friends!.findIndex((item): boolean => item === userId)
      if (id !== -1) throw new Error(errorFeedBack.friends.exist)
      await Friends.updateOne({ userId }, { friends: [...accountFriends.friends!, friendId] })
      await Friends.updateOne({ userId: friendId }, { friends: [...accountNewFriendFriends.friends!, userId] })
    } catch(e) {
      throw new Error(e.message)
    }
  }
  async removeItemFromFriend(userId: number, friendId: number) {
    try {
      if (userId || !friendId) throw new Error(errorFeedBack.userData.empty)
      const accountFriends = await Friends.findOne({ userId })
      const exFriendFriends = await Friends.findOne({ userId: friendId })
      if (!accountFriends || !exFriendFriends) throw new Error(errorFeedBack.userData.empty)
      const id: number = accountFriends.friends!.findIndex((item): boolean => item === friendId)
      const idExFriend: number = exFriendFriends.friends!.findIndex((item): boolean => item === userId)
      if (id === -1 || idExFriend === -1) throw new Error(errorFeedBack.friends.empty)
      await Friends.updateOne({ userId }, { friends: accountFriends.friends!.filter(item => item !== friendId) })
      await Friends.updateOne({ userId: friendId }, { friends: exFriendFriends.friends!.filter(item => item !== userId) })
    } catch(e) {
      throw new Error(e.message)
    }
  }
}
const accountFriends = new AccountFriends()
export default accountFriends