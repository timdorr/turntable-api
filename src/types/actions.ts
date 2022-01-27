import { ResponseMessage } from './messages'
import { Room, User } from './objects'

export interface RoomInfo extends ResponseMessage {
  room: Room & { users: User[] }
}

interface PM {
  command: 'pmmed'
  userid: string
  senderid: string
  text: string
  time: number
  roomobj: Room
}

export interface PMHistory extends ResponseMessage {
  history: PM[]
}
