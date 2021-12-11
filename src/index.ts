import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphql'
import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core'
import { createServer } from 'http'
import jwt from 'jsonwebtoken'
import { getKey } from './middleware/auth.middleware'
import staticRouter from './controllers/static.router'
import sessionRouter from './controllers/session.router'
import { PrismaClient } from '.prisma/client'

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config()

// Create Express server
const PORT = parseInt(process.env.PORT as string) || 8080
const app = express()
const httpServer = createServer(app)

//Prisma
const prisma = new PrismaClient()

// Auth0
const jwtOptions = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  audience: process.env.AUTH0_AUDIENCE!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  issuer: process.env.AUTH0_DOMAIN!,
  algorithms: ['RS256']
}

// Apollo server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  debug: process.env.DEV === 'true',
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: ({ req }) => {
    // simple auth check on every request
    const token = req.headers.authorization
    if (!token) {
      throw new AuthenticationError('You must be logged in to access this resource')
    }
    const user = new Promise((resolve, reject) => {
      // @ts-expect-error Rot op joh dit is gewoon goedwerkende js code
      jwt.verify(token, getKey, jwtOptions, (err, decoded) => {
        if (err) {
          reject(err)
        }
        resolve(decoded.email)
      })
    })

    return {
      user
    }
  },
})

// Swagger


/**
 * Middlewares
 */
app.use(cors({
  origin: '*',
}))
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(morgan(process.env.DEV === 'true' ? 'dev' : 'combined'))
app.use(express.json())

/**
 * Bind database to express.request
 */
app.use((req, _res, next) => {
  req.db = prisma
  next()
})

/**
 * Routes
 */
app.use(process.env.DEFAULT_URL, staticRouter)
app.use(process.env.DEFAULT_URL + 'session', sessionRouter)

/**
 * Run the server
 */
const startServer = async () => {

  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve))
    
    
  console.log(`
    🚀 Server listening on port ${PORT}
    🌎 Open http://localhost:${PORT} in your browser
    🌑 Open apollo playground at http://localhost:${PORT}/graphql
    `)

}

process.on('SIGTERM', () => {
  console.log('Shutting down')
  prisma.$disconnect()
})

startServer()
  .catch(e => {
    throw e
  }).finally(async () => {
    await prisma.$disconnect()
  })