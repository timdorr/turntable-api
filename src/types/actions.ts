import { ResponseMessage } from './messages'
import { Room, User } from './objects'

export interface RoomInfo extends ResponseMessage {
  room: Room & { users: User[] }
}
