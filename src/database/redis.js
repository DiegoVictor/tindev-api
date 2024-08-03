import { createClient } from 'redis';

let client;

export async function getClient() {
  if (client) {
    return client;
  }

  client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  await client.connect();

  return client;
}
