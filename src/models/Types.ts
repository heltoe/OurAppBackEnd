export type User = {
  id: number
  email: string
  password: string
  repassword: string
  role: string
}

export type UserInfo = {
  user_id: number
  friend_id?: number
  first_name: string
  last_name: string
  gender: string
  phone: string
  original_photo: string | null
  croped_photo: string | null
}

export type FriendShips = {
  user_id: number
  friend_ship_id: number
}

export type Friends = {
  user_id: number
  friend_id: number
}

export type Token = {
  user_id: number
  token_id: string
}

export type Chat = {
  id: number
  last_message_id: number
}
export type ChatMembers = {
  id: number
  chat_id: number
  user_id: number
  recipient_id: number
}
export type Message = {
  id: number,
  chat_id: number,
  author: number,
  message: string,
  date: string,
}
export type ChatItemSocket = {
  chat_id: number
  last_message: Message
  recipient_info: UserInfo
  user_id: number
}
export type File = {
  id: number
  message_id: number
  source_file: string
}
