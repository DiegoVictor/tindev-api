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

const developerController = new DeveloperController();
const dislikeController = new DislikeController();
const likeController = new LikeController();
const matchController = new MatchController();

routes.post('/developers', DeveloperValidator, developerController.store);

routes.use(Authenticate);

routes.get('/developers', developerController.index);
routes.get('/developers/:id', IdValidator, developerController.show);

routes.post(
  '/developers/:liked_user_id/like',
  LikedUserIdValidator,
  likeController.store
);
routes.post(
  '/developers/:disliked_user_id/dislike',
  DislikedUserIdValidator,
  dislikeController.store
);

routes.get('/matches', matchController.index);

export default routes;
