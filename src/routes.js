import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import DislikeController from './app/controllers/DislikeController';
import LikeController from './app/controllers/LikeController';
import MatchController from './app/controllers/MatchController';
import authenticate from './app/middlewares/authenticate';
import DeveloperValidator from './app/validators/DeveloperValidator';
import IdValidator from './app/validators/IdValidator';

const app = Router();

const developerController = new DeveloperController();
const dislikeController = new DislikeController();
const likeController = new LikeController();
const matchController = new MatchController();

app.post('/developers', DeveloperValidator, developerController.store);

app.use(authenticate);

app.get('/developers', developerController.index);
app.get('/developers/:id', IdValidator, developerController.show);

app.post('/developers/:id/like', IdValidator, likeController.store);
app.post('/developers/:id/dislike', IdValidator, dislikeController.store);

app.get('/matches', matchController.index);

export default app;
