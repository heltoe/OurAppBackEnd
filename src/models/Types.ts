export type User = {
  id: number
  email: string
  password: string
  repassword: string
  role: string
}

export type UserInfo = {
  user_id: number
  first_name: string
  last_name: string
  gender: string
  birth_date: string
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
  id_chat: number
  members: number[]
  last_message: number
}
export type Message = {
  id_message: number,
  id_chat: number,
  author: number,
  message: string,
  date: string,
}