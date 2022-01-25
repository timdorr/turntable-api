import Connection, { MessageCallback } from './connection'

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

  constructor(options: TurntableOptions) {
    this.options = options
    this.conn = new Connection(options?.host, options.userId, options.userAuth, this.onMessage)
    this.conn.debug = !!options.debug

    setInterval(() => this.updatePresence(), 10000)
  }

  onMessage: MessageCallback = message => {
    if (message == 'no_session') {
      this.authenticate()
    } else {
      console.log(message)
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
    return this.conn.sendMessage({ api: 'room.register', roomid })
  }
}

export default Turntable
