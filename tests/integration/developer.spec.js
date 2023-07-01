import request from 'supertest';
import MockAdapter from 'axios-mock-adapter';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import app from '../../src/app';
import factory from '../utils/factory';
import Developer from '../../src/app/models/Developer';
import { api } from '../../src/app/services/GithubUser';
import jwtoken from '../utils/jwtoken';

describe('Developer', () => {
  const apiMock = new MockAdapter(api);
  const url = `http://127.0.0.1:${process.env.APP_PORT}/v1/developers`;

  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be able to get a list of developers', async () => {
    const [user, ...developers] = await factory.createMany('Developer', 5);
    const token = jwtoken(user.id);
    const response = await request(app)
      .get('/v1/developers')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(Array.isArray(response.body)).toBe(true);
    developers.forEach((developer) => {
      expect(response.body).toContainEqual({
        ...developer.toJSON(),
        _id: developer._id.toString(),
        createdAt: developer.createdAt.toISOString(),
        updatedAt: developer.updatedAt.toISOString(),
        likes: [],
        url: `${url}/${developer._id}`,
      });
    });
  });

  it('should not be able to get a list of developers', async () => {
    const [user] = await factory.createMany('Developer', 5);
    const token = jwtoken(user.id);

    await Developer.findByIdAndDelete(user._id);

    const response = await request(app)
      .get('/v1/developers')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .send();

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Developer not exists',
    });
  });

  it('should be able to get a developer', async () => {
    const user = await factory.create('Developer');
    const token = jwtoken(user.id);
    const response = await request(app)
      .get(`/v1/developers/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toStrictEqual({
      avatar: user.avatar,
      name: user.name,
      url: `${url}/${user._id}`,
    });
  });

  it('should be able to store a new developer', async () => {
    const { user, name, bio, avatar } = await factory.attrs('Developer');

    apiMock
      .onGet(`/users/${user.toLowerCase()}`)
      .reply(200, { name, bio, avatar_url: avatar });

    const response = await request(app)
      .post('/v1/developers')
      .send({ username: user });

    expect(response.body).toMatchObject({
      developer: {
        name,
        user: user.toLowerCase(),
        bio,
        avatar,
      },
      token: expect.any(String),
    });
  });

  it('should be able to signin with an existing developer', async () => {
    const { user, name, bio, avatar } = await factory.create('Developer', {
      user: faker.internet.userName().toLowerCase(),
    });

    apiMock
      .onGet(`/users/${user.toLowerCase()}`)
      .reply(200, { name, bio, avatar_url: avatar });

    const response = await request(app)
      .post('/v1/developers')
      .send({ username: user });

    expect(response.body).toMatchObject({
      developer: {
        name,
        user: user.toLowerCase(),
        bio,
        avatar,
      },
      token: expect.any(String),
    });
  });
});
