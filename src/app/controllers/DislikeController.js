import DeveloperExists from '../services/DeveloperExists';

const developerExists = new DeveloperExists();

class DislikeController {
  async store(req, res) {
    const { userId } = req;
    const dislikedDeveloper = await developerExists.execute({
      id: req.params.disliked_user_id,
    });
    const developer = await developerExists.execute({ id: userId });

    if (!developer.dislikes.includes(dislikedDeveloper._id)) {
      developer.dislikes.push(dislikedDeveloper._id);
      await developer.save();
    }

    return res.json(developer);
  }
}

export default DislikeController;
