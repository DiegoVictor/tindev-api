import 'dotenv/config';

import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import http from 'http';
import helmet from 'helmet';

import routes from './routes';
import './database';
import { setupWebSocket } from './websocket';

const app = express();
const server = http.Server(app);

setupWebSocket(server);

app.use(helmet());

app.use(cors());
app.use(express.json());


app.use('/v1', routes);

app.use(async (err, req, res, next) => {

  if (err.data) {
    payload.details = err.data;
  }

  return res.status(payload.statusCode).json(payload);
});

export default server;
