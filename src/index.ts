import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as redislib from 'redis';
import * as supabaselib from '@supabase/supabase-js'
import { inputRouter } from "./input";
import { streamRouter } from "./stream";
import { EventEmitter } from "stream";
import { GlobalEmit, TawaEmitter } from "./emitter";
import { pushToList } from "./redis";

/**
 * Config
 */
dotenv.config()

if (!process.env.PORT || !process.env.REDIS_STRING || !process.env.SUPABASE_URL || !process.env.SUPABASE_TOKEN || !process.env.DEV) {
  console.log('Please set PORT, REDIS_STRING, SUPABASE_URL, DEV and SUPABASE_TOKEN in .env')
  process.exit(1);
}
 
const DEV: boolean = process.env.DEV === 'true'
const PORT: number = parseInt(process.env.PORT as string, 10);
const REDIS_STRING: string = process.env.REDIS_STRING!
const SUPABASE_URL: string = process.env.SUPABASE_URL!
const SUPABASE_TOKEN: string = process.env.SUPABASE_TOKEN!

/**
 * (Global) variables
 */

const app = express();
const events = new TawaEmitter()
const redis = redislib.createClient({ url: REDIS_STRING });
const supabase = supabaselib.createClient(SUPABASE_URL, SUPABASE_TOKEN)

/**
 * Middleware
 */
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  req.events = events
  req.redis  = redis
  next()
})

/**
 * Redis
 */
redis.on('error', (err) => {
  console.error(`Redis Error: ${err}`);
})

events.on('*', (data: GlobalEmit) => {
  pushToList(redis, data.session, JSON.stringify(data))
  console.log('GLOBAL DATA: ', data)
})

supabase.from('session').on('INSERT', async (session: any) => {
  console.log('Session created: ', session)
  await pushToList(redis, session.id, JSON.stringify({ session: session.id, data: { type: 'session', data: session } }))
})

/**
 * Routes
 */
// Index.html
app.get('/', (req, res) => res.sendFile('index.html', { root: './public' }));
// public files
app.use('/', express.static('public'))

app.use('/input', inputRouter)
app.use('/stream', streamRouter)

/**
 * Run the server
 */

async function start() {
  await redis.connect()
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

start().catch(console.error)