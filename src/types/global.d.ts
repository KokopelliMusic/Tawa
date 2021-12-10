import { PrismaClient } from ".prisma/client"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DEV: string;
      AUTH0_DOMAIN: string;
      AUTH0_AUDIENCE: string;
      AUTH0_CLIENT_ID: string;
      DATABASE_URL: string;
      DEFAULT_URL: string;
    }
  }  

  namespace Express {
    export interface Request {
      db: PrismaClient
    }
  }
}