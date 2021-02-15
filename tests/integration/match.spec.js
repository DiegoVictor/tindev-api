import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/app';
import factory from '../utils/factory';
import Developer from '../../src/app/models/Developer';
import jwtoken from '../utils/jwtoken';

describe('Match', () => {
  const url = `http://127.0.0.1:${process.env.APP_PORT}/v1/developers`;
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should be able to get a list of users' matches", async () => {
    const user = await factory.create('Developer');
    const developers = await factory.createMany('Developer', 3, {
      likes: [user._id],
    });
    const token = jwtoken(user.id);

    developers.forEach(({ _id }) => {
      user.likes.push(_id);
    });
    await user.save();

    const response = await request(app)
      .get('/v1/matches')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.length).toBe(3);
    expect(Array.isArray(response.body)).toBe(true);
    developers.forEach(developer => {
      expect(response.body).toContainEqual({
        ...developer.toJSON(),
        _id: developer._id.toString(),
        createdAt: developer.createdAt.toISOString(),
        updatedAt: developer.updatedAt.toISOString(),
        likes: [user._id.toString()],
        url: `${url}/${developer._id}`,
      });
    });
  });
});
