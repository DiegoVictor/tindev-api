import 'dotenv/config';

import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import { errors } from 'celebrate';
import { isBoom } from '@hapi/boom';

import './database/mongodb';
import routes from './routes';
import routeAliases from './app/middlewares/routeAliases';
import { setupWebSocket } from './websocket';

const app = express();
const server = http.Server(app);

setupWebSocket(server);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(routeAliases);

app.use('/v1', routes);

app.use(errors());
app.use(async (err, _, res, next) => {
  if (isBoom(err)) {
    const { statusCode, payload } = err.output;

    return res.status(statusCode).json({
      ...payload,
      ...err.data,
      docs: process.env.DOCS_URL,
    });
  }

  return next(err);
});

export default server;
