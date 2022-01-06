import { RedisClientType } from "@node-redis/client";

const MAX_LIST_SIZE = 100
const TTL = 60 * 60 * 24 // 1 day

export const pushToList = async (redis: RedisClientType<any, Record<string, never>>, list: string, val: string) => {
  await redis.LPUSH(list, val)
  // every time we push to the list, reset its TTL to 1 day
  await redis.EXPIRE(list, TTL)
  await redis.LTRIM(list, 0, MAX_LIST_SIZE)
}

export const getList = async (redis: RedisClientType<any, Record<string, never>>, listname: string): Promise<any[]> => {
  const list = await redis.LRANGE(listname, 0, MAX_LIST_SIZE)
  return list.map(el => JSON.parse(el))
}

/**
 * Check if a session still exists.
 * This will return false if there has been no activity in the last 24 hours.
 */
export const listExists = async (redis: RedisClientType<any, Record<string, never>>, listname: string): Promise<boolean> => {
  return await redis.EXISTS(listname)
}