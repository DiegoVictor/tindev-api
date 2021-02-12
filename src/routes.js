import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import DislikeController from './app/controllers/DislikeController';
import MatchController from './app/controllers/MatchController';
import DeveloperStore from './app/validators/Developer/Store';
import Authenticate from './app/middlewares/Authenticate';

const routes = Router();

export default routes;
