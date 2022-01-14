import express from 'express'

export const inputRouter = express.Router()

type EventInput = {
  session: string
  clientType: string
  eventType: EventTypes
  data: object
}

export enum EventTypes {
  GENERIC = 'generic',

  SESSION_CREATED = 'session_created',
  SESSION_REMOVED = 'session_removed',
  
  SKIP_SONG = 'skip_song',
  PLAY_SONG = 'play_song',
  PREVIOUS_SONG = 'previous_song',
  RESUME_PLAYBACK = 'resume_playback',
  PAUSE_PLAYBACK = 'pause_playback',

  YOUTUBE_SONG_ADDED = 'youtube_song_added',
  SPOTIFY_SONG_ADDED = 'spotify_song_added',
  SONG_REMOVED = 'song_removed',
  NEW_USER = 'new_user',

  SONG_FINISHED = 'song_finished',
  NEXT_SONG = 'next_song',
  PLAYLIST_FINISHED = 'playlist_finished',

  SPOTIFY_ERROR = 'spotify_error',
  YOUTUBE_ERROR = 'youtube_error',
  PLAYLIST_TOO_SMALL_ERROR = 'playlist_too_small_error',
}

inputRouter.post('/:session', (req, res) => {
  let session = req.params.session

  if (!session) {
    res.status(400).json({ error: true, message: 'Usage: /stream/<session>' })
    return
  }

  if (session.length !== 4) {
    res.status(400).send({ error: true, message: 'Session must be 4 characters long' })
    return
  }

  session = session.toUpperCase()

  if (!req.body.clientType || !req.body.data || !req.body.eventType) {
    if (!Object.values(EventTypes).includes(req.body.eventType)) {
      return res.status(400).send({ error: true, message: 'Invalid event type. Possible values: ' + Object.values(EventTypes).join(', ') })
    }
    return res.status(400).send({ error: true, message: 'Missing input clientType, eventType or data' })
  }

  const event = Object.assign(req.body, {
    date: new Date().getTime(),
    session,
  })

  req.events.emit(req.body.session, event)

  res.status(200).json({ message: 'OK', error: false })

})