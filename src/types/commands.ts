import { CommandMessage } from './messages'

interface Room {
  chatserver: [string, number]
  description: string
  created: number
  shortcut: string
  name: string
  roomid: string
  metadata: {
    privacy: 'public' | 'private'
    featured: boolean
    screen_uploads_allowed: boolean
    upvotes: number
    downvotes: number
    votelog: []
    current_song: Song
    songlog: Song[]
    listeners: number
    max_size: number
    max_djs: number
    userid: string
    current_dj: string
    djs: string[]
    djcount: number
    djthreshold: number
    dj_full: boolean
    moderator_id: string[]
  }
}

interface User {
  userid: string
  name: string
  bot: boolean
  points: number
  fans: number
  fanofs: number
}

interface DJList {
  0?: string
  1?: string
  2?: string
  3?: string
  4?: string
}

interface Song {
  _id: string
  djid: string
  djname: string
  metadata: {
    adult: boolean
    artist: string
    coverart: string
    length: number
    song: string
    ytid: string
  }
  created: number
  score: number
  source: 'yt' | 'sc'
  sourceid: string
}

export interface Registered extends CommandMessage {
  command: 'registered'
  roomid: string
  user: User[]
}

export interface Deregistered extends CommandMessage {
  command: 'deregistered'
  roomid: string
  user: User[]
}

export interface AddDJ extends CommandMessage {
  command: 'add_dj'
  roomid: string
  user: User[]
  djs: DJList
}

export interface RemoveDJ extends CommandMessage {
  command: 'rem_dj'
  roomid: string
  user: User[]
  djs: DJList
}

export interface NewSong extends CommandMessage {
  command: 'newsong'
  roomid: string
  now: number
  room: Room
}

export interface NoSong extends CommandMessage {
  command: 'nosong'
  roomid: string
  room: Room
}

export interface UpdateVotes extends CommandMessage {
  command: 'update_votes'
  roomid: string
  current_song: { starttime: number; _id: string }
  room: {
    metadata: {
      downvotes: number
      listeners: number
      upvotes: number
      votelog: [string, 'up' | 'down'][]
    }
  }
}

export interface UpdateRoom extends CommandMessage {
  command: 'update_room'
  roomid: string
  description: string
}

export interface Speak extends CommandMessage {
  command: 'speak'
  roomid: string
  userid: string
  name: string
  text: string
}
