import { Router } from 'express';
import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';

import DeveloperConotroller from './app/controllers/DeveloperController';
import LikeController from './app/controllers/LikeController';
import DislikeController from './app/controllers/DislikeController';
import MatchController from './app/controllers/MatchController';
import DeveloperStore from './app/validators/Developer/Store';
import Authenticate from './app/middlewares/Authenticate';

const routes = Router();

export default routes;
