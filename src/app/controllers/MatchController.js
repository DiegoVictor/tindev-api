import Developer from '../models/Developer';

class MatchController {
  async index(req, res) {
    const { user_id } = req;
    const { likes } = await Developer.findById(user_id);
    const matches = await Developer.find({
      _id: { $in: likes },
      likes: { $in: user_id },
    });

    return res.json(matches);
  }
}

export default MatchController;
