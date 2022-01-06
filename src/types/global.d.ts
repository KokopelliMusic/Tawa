import { RedisClientType } from "@node-redis/client";
import { TawaEmitter } from "../emitter";

declare global {
  namespace Express {
    interface Request {
      events: TawaEmitter
      redis: RedisClientType<?>
    }
  }
}
