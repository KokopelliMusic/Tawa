import express from 'express'

export const inputRouter = express.Router()

type EventInput = {
  session: string
  clientType: string
  data: object
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

  if (!req.body.clientType || !req.body.data) {
    return res.status(400).send({ error: true, message: 'Missing input clientType or data' })
  }

  const event = Object.assign(req.body, {
    date: new Date().getTime(),
    session,
  })

  req.events.emit(req.body.session, event)

  res.status(200).json({ message: 'OK', error: false })

})