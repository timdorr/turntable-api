import { createHash } from 'crypto'

export function sha1(data: string) {
  return createHash('sha1').update(data).digest('hex')
}
