import express from 'express'

export const streamRouter = express.Router()

let conns: Map<string, number> = new Map()

streamRouter.get('/session/:session', (req, res) => {
  let session = req.params.session

  if (session.length !== 4) {
    res.status(400).send({ error: true, message: 'Session must be 4 characters long' })
    return
  }
  // TODO check of deze sessie bestaat

  session = session.toUpperCase()

  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.flushHeaders()


  if (conns.has(session)) {
    conns.set(session, conns.get(session)! + 1)
  } else {
    conns.set(session, 1)
  }

  console.log(`Got a new connection for session ${session}. Current connections: ${conns.get(session)}`)

  req.events.on(session, (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  })

  // Calls when the client closes the SSE
  res.on('close', () => {
    conns.set(session, conns.get(session)! - 1)
    console.log(`Client dropped connection for session ${session}. Current connections: ${conns.get(session)}`);
    res.end()
  })
})