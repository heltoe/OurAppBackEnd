import { Request, Response } from 'express'
import { errorFeedBack } from '../../FeedBack'
import { usersInfoTable, usersFriendShipTable, usersFriendTable } from '../../mongo-models/Tables'
import { UserInfo, FriendShips, Friends } from '../../mongo-models/Types'

class AccountFriends {
  public async getUserList(req: Request, res: Response) {
    try {
      const user_id: string = req.params.id
      const { offset, limit } = req.query as { offset: string | null, limit: string | null }
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const users: UserInfo[] = await usersInfoTable.getEssences({
        identify_data: null,
        offset: offset ? parseInt(offset) : null,
        limit: limit ? parseInt(limit) : null
      })
      // const count = await UserInfo.countDocuments({})
      const count = 0
      const friend_ships: FriendShips[] = await usersFriendShipTable.getEssences({
        identify_data: { user_id: parseInt(user_id) }
      })
      const friends: Friends[] = await usersFriendTable.getEssences({
        identify_data: { user_id: parseInt(user_id) }
      })
      const parsed_users = users.filter(item => item.user_id !== parseInt(user_id)).map(item => ({
        id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        // image: item.photo,
        gender: item.gender,
        birth_date: item.birth_date,
        phone: item.phone,
        exist_in_friend_list: friend_ships.findIndex(friend_ship_item => friend_ship_item.user_id === item.user_id) > -1
          || friends.findIndex(friend_item => friend_item.user_id === item.user_id) > -1
      }))
      return res.status(200).json({
        count,
        next: limit && offset && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(offset)) ? parseInt(limit) * parseInt(offset) < count : false,
        results: parsed_users
      })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getFriends(req: Request, res: Response) {
    try {
      const user_id: string = req.params.id
      const { offset, limit } = req.query as { offset: string | null, limit: string | null }
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const friend_ship: UserInfo[] = await usersFriendTable.getEssences({
        identify_data: { user_id: parseInt(user_id) },
        offset: offset ? parseInt(offset) : null,
        limit: limit ? parseInt(limit) : null
      })
      // const count = await Friends.countDocuments({ user_id: parseInt(user_id) })
      const count = 0
      const parsed_friends = friend_ship.map(item => ({
        id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        // image: item.photo,
        gender: item.gender,
        birth_date: item.birth_date,
        phone: item.phone,
      }))
      return res.status(200).json({
        count,
        next: limit && offset && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(offset)) ? parseInt(limit) * parseInt(offset) < count : false,
        results: parsed_friends
      })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async getFriendShipList(req: Request, res: Response) {
    try {
      const user_id: string = req.params.id
      const { offset, limit } = req.query as { offset: string | null, limit: string | null }
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const friend_ships: UserInfo[] = await usersFriendShipTable.getEssences({
        identify_data: { user_id: parseInt(user_id) },
        offset: offset ? parseInt(offset) : null,
        limit: limit ? parseInt(limit) : null
      })
      // const count = await Friends.countDocuments({ user_id: parseInt(user_id) })
      const count = 0
      const parsed_friend_ships = friend_ships.map(item => ({
        id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        // image: item.photo,
        gender: item.gender,
        birth_date: item.birth_date,
        phone: item.phone,
      }))
      return res.status(200).json({
        count,
        next: limit && offset && Number.isInteger(parseInt(limit)) && Number.isInteger(parseInt(offset)) ? parseInt(limit) * parseInt(offset) < count : false,
        results: parsed_friend_ships
      })
    } catch (e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async addToFriendShip(req: Request, res: Response) {
    try {
      const { user_id, friend_id } = req.body
      if (!user_id || !friend_id) throw new Error(errorFeedBack.requiredFields)
      await usersFriendShipTable.createEssence({ user_id, friend_id })
      return res.status(201).json({ user_id: friend_id })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeFromFriendShip(req: Request, res: Response) {
    try {
      const { user_id, friend_id } = req.body
      await usersFriendShipTable.deleteEssence({ user_id, friend_id })
      return res.status(201).json({ user_id: friend_id })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async addToFriend(req: Request, res: Response) {
    try {
      const { user_id, friend_id } = req.body
      if (!user_id || !friend_id) throw new Error(errorFeedBack.requiredFields)
      await usersFriendShipTable.deleteEssence({ user_id, friend_id })
      await usersFriendTable.createEssence({ user_id, friend_id })
      return res.status(201).json({ user_id: friend_id })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeFromFriend(req: Request, res: Response) {
    try {
      const { user_id, friend_id } = req.body
      if (!user_id || !friend_id) throw new Error(errorFeedBack.requiredFields)
      await usersFriendTable.deleteEssence({ user_id, friend_id })
      return res.status(201).json({ user_id: friend_id })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountFriends = new AccountFriends()
export default accountFriends