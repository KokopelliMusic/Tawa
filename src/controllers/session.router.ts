import { PrismaClient } from ".prisma/client"
import { Router } from "express"
import { randomIntBetweenXandY } from "../util"

const router = Router()

const POSSIBLE_LETTERS = 'ABCDEFGHKLNOPQRSTUVXYZ'

// The map holding all the (session, webplayer) pairs
const sessions = new Map<string, any>()

// Generates a random unique session ID
const generateNewSessionID = async (db: PrismaClient): Promise<string> => {
  let id = ''
  for (let letter = 0; letter < 4; letter++) {
    id += POSSIBLE_LETTERS[randomIntBetweenXandY(0, POSSIBLE_LETTERS.length - 1)]
  }

  if (await sessionExists(id, db)) {
    console.log(`Session id: ${id} already exists. Trying again`)
    id = await generateNewSessionID(db)
    return id
  }
  return id
}

// Tries to get given session from the database, and returns a boolean indicating whether it exists
const sessionExists = async (id: string, db: PrismaClient) => {
  return (await db.session.findFirst({
    where: {
      id
    }
  })) !== null
}

const storeSession = async (id: string, userId: number, playlistId: number, db: PrismaClient) => {
  return await db.session.create({ data: { id, userId, playlistId } })
    .catch(e => e)
}

const getAllSessions = async (db: PrismaClient) => {
  return await db.session.findMany({})
}

/**
 * @api {get} /
 * @apiName Index
 * @apiGroup Session
 * @apiDescription Index page
 */
router.get('/', (req, res) => {
  res.json({
    msg: 'Session router'
  })
})

/**
 * @api {post} /new
 * @apiName New
 * @apiGroup Session
 * @apiDescription Creates a new session
 * 
 */
router.post('/new', async (req, res) => {
  try {
    const id = await generateNewSessionID(req.db)

    sessions.set(id, {})

    res.status(200).json({ 
      status: 200,
      id 
    })

  } catch (e) {
    res.status(500).json({
      status: 500,
      // @ts-expect-error kut ts
      error: e.message
    })
  }
})

/**
 * @api {post} /new Claim a sesison
 * @apiName ClaimSession
 * @apiGroup Session
 * @apiDescription Claims a session and notifies the webplayer
 * @apiParam {Number} userId The user ID
 * @apiParam {Number} playlistId The playlist ID
 * @apiSuccess {String} id The session ID to claim
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    "id": "ABCD"
 *  }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 400 Bad Request
 *  {
 *   "error": "Session already exists"
 * }
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 400 Bad Request
 * {
 * "error": "User does not exist"
 * }
 */
router.post('/claim', async (req, res) => {
  try {
    if (!req.body.userId || !req.body.playlistId || !req.body.id) {
      return res.status(400).json({
        error: 'Missing userId, playlistId, or id (sessionId)'
      })
    }

    if (await sessionExists(req.body.id, req.db)) {
      return res.status(400).json({
        status: 400,
        error: 'Session ' + req.body.id + ' already exists'
      })
    }

    storeSession(req.body.id, req.body.userId, req.body.playlistId, req.db)
      .catch(e => {
        return res.status(500).json({
          status: 500,
          error: e
        })
      })
    res.json({
      status: 200,
    })
  } catch (e) {
    res.status(500).json({
      status: 500,
      // @ts-expect-error kut ts
      error: e.message
    })
  }
})

/**
 * @api {get} /all Get all sessions
 * @apiName GetAllSessions
 * @apiGroup Session
 * @apiDescription Returns all sessions
 * @apiSuccess {Object[]} sessions The sessions
 * @apiSuccess {String} sessions.id The session ID
 * @apiSuccess {Number} sessions.userId The user ID
 * @apiSuccess {Number} sessions.playlistId The playlist ID
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
      "sessions": [
        {
          "id": "ABCD",
          "userId": 1,
          "playlistId": 1
        },
        {
          "id": "EFGH",
          "userId": 2,
          "playlistId": 2
        }
      ]
    }  
 */
router.get('/all', async (req, res) => {
  const sessions = await getAllSessions(req.db)
  res.json(Object.assign({
    status: 200,
    length: sessions.length
  }, sessions))
})

export default router