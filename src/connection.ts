import WebSocket, { RawData } from 'ws'
import Message, { APIMessage, CommandMessage, ResponseMessage } from './messages'

const DEFAULT_HOST = 'wss://chat1.turntable.fm:8080/socket.io/websocket'

export type MessageCallback = (data: CommandMessage | 'no_session') => void

class Connection {
  socket: WebSocket
  handleMessage: MessageCallback
  userid: string
  userauth: string

  debug = false
  msgid = 0
  clientid = `${Date.now()}-${Math.random()}`

  constructor(host = DEFAULT_HOST, userid: string, userauth: string, handleMessage: MessageCallback) {
    this.userid = userid
    this.userauth = userauth

    this.socket = new WebSocket(host)
    this.handleMessage = handleMessage

    this.socket.on('message', this.onMessage)
  }

  parseMessage(data: RawData): Message | string {
    const messageParts = data.toString().match(/^~m~(\d+)~m~(.*?)$/)
    if (!messageParts) return ''

    const [, length, rawMessage] = messageParts
    const message = rawMessage.substring(0, Number(length))

    try {
      return JSON.parse(message)
    } catch {
      return message
    }
  }

  onMessage = (data: RawData) => {
    const message = this.parseMessage(data)
    if (this.debug) console.log('onMessage: %s', message)

    if (typeof message == 'string') {
      if (message == 'no_session') this.handleMessage(message)
    } else {
      if ('command' in message) this.handleMessage(message)
    }
  }

  sendMessage(message: APIMessage) {
    const { msgid, clientid, userid, userauth } = this
    const data = JSON.stringify({ msgid, clientid, userid, userauth, ...message })
    if (this.debug) console.log('sendMessage: %s', data)

    this.socket.send(`~m~${data.length}~m~${data}`)
    this.msgid++

    return new Promise<ResponseMessage>(resolve => {
      const handler = (data: RawData) => {
        const message = this.parseMessage(data)
        if (typeof message == 'object' && 'msgid' in message && message.msgid == msgid) {
          this.socket.off('message', handler)
          resolve(message)
        }
      }

      this.socket.on('message', handler)
    })
  }
}

export default Connection
