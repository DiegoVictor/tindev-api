import jwt from 'jsonwebtoken';

import GithubUser from '../services/GithubUser';
import Developer from '../models/Developer';
import DeveloperExists from '../services/DeveloperExists';

const developerExists = new DeveloperExists();
const githubUser = new GithubUser();

class DeveloperController {
  async index(req, res) {
    const { userId, currentUrl } = req;

    const user = await developerExists.execute({ id: userId });

    const conditions = {
      $and: [
        { _id: { $ne: userId } },
        { _id: { $nin: user.likes } },
        { _id: { $nin: user.dislikes } },
      ],
    };

    const [developers, count] = await Promise.all([
      Developer.find(conditions).lean(),
      Developer.countDocuments(conditions),
    ]);

    res.header('X-Total-Count', count);

    return res.json(
      developers.map((developer) => ({
        ...developer,
        url: `${currentUrl}/${developer._id}`,
      }))
    );
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

    return res.status(201).json({
      developer,
      token: jwt.sign({ id: developer._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    });
  }
}

export default DeveloperController;
