import DeveloperExists from '../services/DeveloperExists';
import MatchDevelopers from '../services/MatchDevelopers';

const developerExists = new DeveloperExists();
const matchDevelopers = new MatchDevelopers();

class LikeController {
  async store(req, res) {
    const { userId } = req;
    const [likedDeveloper, developer] = await Promise.all([
      developerExists.execute({
        id: req.params.id,
      }),
      developerExists.execute({ id: userId }),
    ]);

    await matchDevelopers.execute({ developer, likedDeveloper });

    if (!developer.likes.includes(likedDeveloper._id)) {
      developer.likes.push(likedDeveloper._id);
      await developer.save();
    }

    return res.json(developer);
  }
}

export default LikeController;
