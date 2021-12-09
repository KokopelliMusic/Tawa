import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createServer, Server } from 'http';

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config()

// Create Express server
const PORT = parseInt(process.env.PORT as string) || 8080;
const app = express();
const httpServer = createServer(app);


// Prisma
const prisma = new PrismaClient();

// Apollo server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    debug: process.env.DEV === 'true',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

/**
 * Middlewares
 */
app.use(cors({
    origin: '*',
}));
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(morgan(process.env.DEV === 'true' ? 'dev' : 'combined'));
app.use(express.json());

/**
 * Routes
 */


/**
 * Run the server
 */
const startServer = async () => {

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
    
    
    console.log(`
    🚀 Server listening on port ${PORT}
    🌎 Open http://localhost:${PORT} in your browser
    🌑 Open apollo playground at http://localhost:${PORT}/graphql
    `);

}

startServer()