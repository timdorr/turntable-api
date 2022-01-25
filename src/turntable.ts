import Connection, { MessageCallback } from './connection'
import { sha1 } from './utils'

import type { CommandMessage } from './types/messages'

export type EventHandler = (m: CommandMessage) => void

export interface TurntableOptions {
  host?: string
  userId: string
  userAuth: string
  roomId: string

  debug?: boolean
}

class Turntable {
  options: TurntableOptions
  conn: Connection
  eventHandlers: Record<string, EventHandler[]> = {}

  roomId?: string
  currentDjId?: string
  currentSongId?: string

  constructor(options: TurntableOptions) {
    this.options = options
    this.conn = new Connection(options?.host, options.userId, options.userAuth, this.onMessage)
    this.conn.debug = !!options.debug

    setInterval(() => this.updatePresence(), 10000)
  }

  on(event: string, handler: EventHandler) {
    this.eventHandlers[event] ? this.eventHandlers[event].push(handler) : (this.eventHandlers[event] = [handler])
  }

  onMessage: MessageCallback = message => {
    if (message == 'no_session') {
      this.authenticate()
    } else {
      this.eventHandlers[message.command]?.forEach(handler => handler.apply(this, [message]))
    }
  }

  async authenticate() {
    await this.updatePresence()
    await this.setBot()
    await this.join(this.options.roomId)
  }

  updatePresence() {
    return this.conn.sendMessage({ api: 'presence.update', status: 'available' })
  }

  setBot() {
    return this.conn.sendMessage({ api: 'user.set_bot' })
  }

  join(roomid: string) {
    this.roomId = roomid
    return this.conn.sendMessage({ api: 'room.register', roomid })
  }

  leave() {
    return this.conn.sendMessage({ api: 'room.deregister' })
  }

  roomInfo() {
    return this.conn.sendMessage({ api: 'room.info', roomid: this.roomId })
  }

  speak(text: string) {
    return this.conn.sendMessage({ api: 'room.speak', roomid: this.roomId, text })
  }

  addModerator(target_userid: string) {
    return this.conn.sendMessage({ api: 'room.add_moderator', roomid: this.roomId, target_userid })
  }

  removeModerator(target_userid: string) {
    return this.conn.sendMessage({ api: 'room.rem_moderator', roomid: this.roomId, target_userid })
  }

  bootUser(target_userid: string, reason: string) {
    return this.conn.sendMessage({ api: 'room.boot_user', roomid: this.roomId, target_userid, reason })
  }

  startDJing() {
    return this.conn.sendMessage({ api: 'room.add_dj', roomid: this.roomId })
  }

  removeDJ(djid?: string) {
    return this.conn.sendMessage({ api: 'room.rem_dj', roomid: this.roomId, djid: djid || this.options.userId })
  }

  skipSong() {
    return this.conn.sendMessage({
      api: 'room.stop_song',
      roomid: this.roomId,
      djid: this.currentDjId,
      current_song: this.currentSongId
    })
  }

  vote(val: 'up' | 'down') {
    const vh = sha1(this.roomId + val + this.currentSongId)
    const th = sha1(Math.random().toString())
    const ph = sha1(Math.random().toString())

    return this.conn.sendMessage({ api: 'room.vote', roomid: this.roomId, val, vh, th, ph })
  }

  voteUp() {
    return this.vote('up')
  }

  voteDown() {
    return this.vote('down')
  }
}

export default Turntable
