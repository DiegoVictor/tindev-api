import Developer from '../models/Developer';

class MatchController {
  async index(req, res) {
    const { userId, hostUrl } = req;
    const { likes } = await Developer.findById(userId);
    const conditions = {
      _id: { $in: likes },
      likes: { $in: [userId] },
    };

    const [matches, count] = await Promise.all([
      Developer.find(conditions).lean(),
      Developer.countDocuments(conditions),
    ]);

    res.header('X-Total-Count', count);

    return res.json(
      matches.map((match) => ({
        ...match,
        url: `${hostUrl}/v1/developers/${match._id}`,
      }))
    );
  }
}

export default MatchController;
