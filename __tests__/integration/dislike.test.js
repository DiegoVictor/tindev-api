import request from 'supertest';

import app from '../../src/app';
import factory from '../utils/factories';
import Developer from '../../src/app/models/Developer';

describe('Dislike', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  it('should be able to dislike an user', async () => {
    const [user, dislike_user] = await factory.createMany('Developer', 2);
    const response = await request(app)
      .post(`/developers/${dislike_user._id}/dislike`)
      .set('user_id', user._id)
      .send();

    expect(response.body.dislikes).toContain(dislike_user._id.toString());
  });

  it('should not be able to dislike an user', async () => {
    const [user, dislike_user] = await factory.createMany('Developer', 2);
    await user.delete();

    const response = await request(app)
      .post(`/developers/${dislike_user._id}/dislike`)
      .set('user_id', user._id)
      .send();

    expect(response.body).toStrictEqual({
      error: 'Developer not exists',
    });
  });

  it('should not be able to dislike an user that not exists', async () => {
    const [user, dislike_user] = await factory.createMany('Developer', 2);
    dislike_user.remove();

    const response = await request(app)
      .post(`/developers/${dislike_user._id}/dislike`)
      .set('user_id', user._id)
      .send();

    expect(response.body).toStrictEqual({
      error: 'Developer not exists!',
    });
  });

  it('should be able to dislike an user twice', async () => {
    const [user, dislike_user] = await factory.createMany('Developer', 2);

    user.dislikes.push(dislike_user._id);
    await user.save();

    const response = await request(app)
      .post(`/developers/${dislike_user._id}/dislike`)
      .set('user_id', user._id)
      .send();

    expect(response.body.dislikes).toContain(dislike_user._id.toString());
  });
});
