import { createClient } from 'redis';
// eslint-disable-next-line import/no-extraneous-dependencies
import redis from 'redis-mock';

let client;

export async function getClient() {
  if (client) {
    return client;
  }

  if (process.env.NODE_ENV === 'test') {
    client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    return client;
  }

  client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  await client.connect();

  return client;
}
