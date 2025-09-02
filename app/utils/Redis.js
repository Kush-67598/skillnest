// lib/redis.js
import { createClient } from "redis";

let client;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      username: "default",
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
  }
  return client;
}
