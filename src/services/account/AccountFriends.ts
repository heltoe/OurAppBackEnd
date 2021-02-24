import { Request, Response } from 'express'
import { errorFeedBack } from '../../FeedBack'
import { usersInfoTable, usersFriendShipTable, usersFriendTable } from '../../models/Tables'
import { UserInfo, FriendShips, Friends } from '../../models/Types'

type CommonInfoForTable = {
  user_id: number
  friend_id: number
}
type LimitedRows = {
  offset: string | null
  limit: string | null
}
class AccountFriends {
  public async getUserList(req: Request, res: Response) {
    try {
      const user_id: string = req.params.id
      const { offset, limit } = req.query as LimitedRows
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const { rows, count }: { rows: UserInfo[], count: number } = await usersInfoTable.getEssences({
        identify_data: null,
        exclude: { user_id: parseInt(user_id) },
        offset: offset && limit ? parseInt(offset) * parseInt(limit) : null,
        limit: limit ? parseInt(limit): null
      })
      const friend_ships_data: { rows: FriendShips[], count: number } = await usersFriendShipTable.getEssences({
        identify_data: { friend_ship_id: parseInt(user_id) }
      })
      const friends_data: { rows: Friends[], count: number } = await usersFriendTable.getEssences({
        identify_data: { user_id: parseInt(user_id) }
      })
      const arrId = [...friend_ships_data.rows.map(item => item.user_id), ...friends_data.rows.map(item => item.friend_id)]
      const parsed_users = rows.map(item => ({
        id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        // image: item.photo,
        gender: item.gender,
        birth_date: item.birth_date,
        phone: item.phone,
        exist_in_friend_list: arrId.findIndex(item_id => item_id === item.user_id) > -1
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
      const { offset, limit } = req.query as LimitedRows
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const { rows, count }: { rows: UserInfo[], count: number } = await usersFriendTable.getEssencesJoin({
        from: 'users_info',
        join: 'users_friend',
        identifyFrom: 'user_id',
        identifyJoin: 'user_id',
        exclude: parseInt(user_id),
        limit: limit ? parseInt(limit) : null,
        offset: offset && limit ? parseInt(offset) * parseInt(limit) : null,
      })
      const parsed_friends = rows.map(item => ({
        id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        gender: item.gender,
        birth_date: item.birth_date,
        phone: item.phone,
        photo: item.photo
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
      const { offset, limit } = req.query as LimitedRows
      if (!user_id && !user_id.length) throw new Error(errorFeedBack.requiredFields)
      const { rows, count }: { rows: any[], count: number } = await usersFriendShipTable.getEssencesJoin({
        from: 'users_info',
        join: 'users_friendship',
        identifyFrom: 'user_id',
        identifyJoin: 'friend_ship_id',
        fields: ['friend_ship_id','first_name','last_name','gender','birth_date','phone','photo'],
        limit: limit ? parseInt(limit) : null,
        offset: offset && limit ? parseInt(offset) * parseInt(limit) : null,
      })
      const parsed_friend_ships = rows.map(item => ({
        id: item.friend_ship_id,
        first_name: item.first_name,
        last_name: item.last_name,
        gender: item.gender,
        birth_date: item.birth_date,
        phone: item.phone,
        photo: item.photo
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
      const { user_id, friend_id }: CommonInfoForTable = req.body
      if (!user_id || !friend_id) throw new Error(errorFeedBack.requiredFields)
      await usersFriendShipTable.createEssence({ user_id: friend_id, friend_ship_id: user_id })
      return res.status(201).json({ user_id: friend_id })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeFromFriendShip(req: Request, res: Response) {
    try {
      const { user_id, friend_id }: CommonInfoForTable = req.body
      if (!user_id || !friend_id) throw new Error(errorFeedBack.requiredFields)
      await usersFriendShipTable.deleteEssence({ user_id })
      return res.status(201).json({ user_id: friend_id })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async addToFriend(req: Request, res: Response) {
    try {
      const { user_id, friend_id }: CommonInfoForTable = req.body
      if (!user_id || !friend_id) throw new Error(errorFeedBack.requiredFields)
      await usersFriendShipTable.deleteEssence({ user_id })
      console.log(user_id, friend_id)
      await usersFriendTable.createEssence({ user_id, friend_id })
      await usersFriendTable.createEssence({ user_id: friend_id, friend_id: user_id })
      return res.status(201).json({ user_id: friend_id })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
  public async removeFromFriend(req: Request, res: Response) {
    try {
      const { user_id, friend_id }: CommonInfoForTable = req.body
      if (!user_id || !friend_id) throw new Error(errorFeedBack.requiredFields)
      await usersFriendTable.deleteEssence({ user_id: friend_id })
      await usersFriendTable.deleteEssence({ user_id })
      return res.status(201).json({ user_id: friend_id })
    } catch(e) {
      return res.status(404).json({ message: e.message })
    }
  }
}
const accountFriends = new AccountFriends()
export default accountFriends