import mongoose from 'mongoose';

import '../../src/app';
import Developer from '../../src/app/models/Developer';
import MatchDevelopers from '../../src/app/services/MatchDevelopers';
import { emit, to } from '../../mocks/socket.io';
import factory from '../utils/factory';

describe('MatchDevelopers', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should not be able to emit socket event when users is not connected', async () => {
    const [user, matchedUser] = await factory.createMany('Developer', 2);
    const matchDevelopers = new MatchDevelopers();

    matchedUser.likes.push(user._id);
    await matchedUser.save();

    await matchDevelopers.execute({
      developer: user,
      likedDeveloper: matchedUser,
    });

    expect(to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });
});
