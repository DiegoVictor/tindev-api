import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import DislikeController from './app/controllers/DislikeController';
import LikeController from './app/controllers/LikeController';
import MatchController from './app/controllers/MatchController';
import Authenticate from './app/middlewares/Authenticate';
import DeveloperValidator from './app/validators/DeveloperValidator';
import DislikedUserIdValidator from './app/validators/DislikedUserIdValidator';
import IdValidator from './app/validators/IdValidator';
import LikedUserIdValidator from './app/validators/LikedUserIdValidator';

const routes = Router();

export default routes;
