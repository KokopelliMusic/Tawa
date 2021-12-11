import { PrismaClient } from ".prisma/client"
import { Router } from "express"
import { randomIntBetweenXandY } from "../util"

const router = Router()

const POSSIBLE_LETTERS = 'ABCDEFGHKLNOPQRSTUVXYZ'

// Generates a random unique session ID
const generateNewSessionID = async (db: PrismaClient): Promise<string> => {
  let id = ''
  for (let letter = 0; letter < 4; letter++) {
    id += POSSIBLE_LETTERS[randomIntBetweenXandY(0, POSSIBLE_LETTERS.length)]
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

const getAllSessions = async (db: PrismaClient) => {
  return await db.session.findMany({})
}

router.get('/', (req, res) => {
  res.json({
    msg: 'Session router'
  })
})

router.post('/new', async (req, res) => {
  throw new Error('TODO: session.router.post->new')
})

router.get('/all', async (req, res) => {
  const sessions = await getAllSessions(req.db)
  res.json(Object.assign({
    status: 200,
    length: sessions.length
  }, sessions))
})

export default router