import 'dotenv/config';

import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import Sentry from '@sentry/node';
import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

import routes from './routes';
import './database';
import { setupWebSocket } from './websocket';

const app = express();
const server = http.Server(app);

setupWebSocket(server);

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}

app.use(helmet());

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  App.use(
    new RateLimit({
      max: 100,
      windowMs: 1000 * 60 * 15,
      store: new RedisStore({
        client: redis.createClient({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
      }),
    })
  );
}

app.use('/v1', routes);

app.use(async (err, req, res, next) => {

  if (err.data) {
    payload.details = err.data;
  }

  return res.status(payload.statusCode).json(payload);
});

export default server;
