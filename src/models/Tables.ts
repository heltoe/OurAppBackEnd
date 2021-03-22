import { CommonEssence } from './CommonEssence'

export const usersTable = new CommonEssence('users')
export const usersTokenTable = new CommonEssence('users_tokens')
export const usersInfoTable = new CommonEssence('users_info')
export const usersFriendShipTable = new CommonEssence('users_friendship')
export const usersFriendTable = new CommonEssence('users_friend')
export const usersChatsTable = new CommonEssence('users_chat')
export const chatsMessagesTable = new CommonEssence('chat_messages')

export const tables = {
  user: usersTable,
  token: usersTokenTable,
  info: usersInfoTable,
  friendship: usersFriendShipTable,
  friend: usersFriendTable,
  chats: usersChatsTable,
  messages: chatsMessagesTable
}