import { createClient } from "redis";
const client = createClient({
  username: "default",
  password: "pS7fcZ6K2J27l37J2lwYW541LvWOeOOF",
  socket: {
    host: "redis-15706.c99.us-east-1-4.ec2.redns.redis-cloud.com",
    port: 15706,
  },
});
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();
await client.set("foo", "bar");
const result = await client.get("foo");
console.log(result, "redis working");

export default client;
