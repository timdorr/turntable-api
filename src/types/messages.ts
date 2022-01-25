type Message = ResponseMessage | CommandMessage
export default Message

export interface ResponseMessage {
  msgid: number
}

export interface CommandMessage {
  command: string
  success: boolean
}

export interface APIMessage extends Record<string, unknown> {
  api: string
}
