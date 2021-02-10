import jwt from 'jsonwebtoken';

import GithubUser from '../services/GithubUser';
import Developer from '../models/Developer';
import DeveloperExists from '../services/DeveloperExists';

const githubUser = new GithubUser();
class DeveloperController {
  async index(req, res) {
    const { user_id } = req;

    const user = await DeveloperExists.run({ id: user_id });
    const developers = await Developer.find({
      $and: [
        { _id: { $ne: user_id } },
        { _id: { $nin: user.likes } },
        { _id: { $nin: user.dislikes } },
      ],
    });

    return res.json(developers);
  }

  async show(req, res) {
    const { currentUrl } = req;
    const { avatar, name } = await developerExists.execute({
      id: req.params.id,
    });
    return res.json({ avatar, name, url: currentUrl });
  }

  async store(req, res) {
    const user = req.body.username.toLowerCase();

    let developer = await Developer.findOne({ user });
    if (!developer) {
      const { data } = await githubUser.execute({ user });
      const { name, bio, avatar_url: avatar } = data;

      developer = await Developer.create({ name, user, bio, avatar });
    }

    return res.json({
      developer,
      token: jwt.sign({ id: developer._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    });
  }
}

export default DeveloperController;
