import { RedisClientType } from "@node-redis/client";
import { EventEmitter } from "stream";

declare global {
  namespace Express {
    interface Request {
      events: EventEmitter
      redis: RedisClientType<?>
    }
  }
}
