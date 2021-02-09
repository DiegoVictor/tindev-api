import DeveloperExists from '../services/DeveloperExists';
import MatchDevelopers from '../services/MatchDevelopers';

class LikeController {
  async store(req, res) {
    const { userId } = req;
    const likedDeveloper = await developerExists.execute({
      id: req.params.liked_user_id,
    });
    const developer = await developerExists.execute({ id: userId });

    await matchDevelopers.execute({ developer, likedDeveloper });

    if (!developer.likes.includes(likedDeveloper._id)) {
      developer.likes.push(likedDeveloper._id);
      await developer.save();
    }

    return res.json(developer);
  }
}

export default new LikeController();
