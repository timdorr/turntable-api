export interface Room {
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
    current_song: Song | null
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

export interface User {
  userid: string
  name: string
  bot: boolean
  points: number
  fans: number
  fanofs: number
}

export interface DJList {
  0?: string
  1?: string
  2?: string
  3?: string
  4?: string
}

export interface Song {
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
