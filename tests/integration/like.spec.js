import request from 'supertest';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

import app from '../../src/app';
import jwtoken from '../utils/jwtoken';
import factory from '../utils/factory';
import Developer from '../../src/app/models/Developer';
import { connect, emit, to } from '../../mocks/socket.io';

describe('Like', () => {
  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be able to like an user', async () => {
    const [user, likeUser] = await factory.createMany('Developer', 2);
    const token = jwtoken(user.id);
    const response = await request(app)
      .post(`/v1/developers/${likeUser._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.likes).toContain(likeUser._id.toString());
  });

  it('should be able to like twice an user', async () => {
    const [user, likeUser] = await factory.createMany('Developer', 2);
    const token = jwtoken(user.id);

    user.likes.push(likeUser._id);
    await user.save();

    const response = await request(app)
      .post(`/v1/developers/${likeUser._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body.likes).toContain(likeUser._id.toString());
  });

  it('should not be able to like an user', async () => {
    const [user, likeUser] = await factory.createMany('Developer', 2);
    const token = jwtoken(user.id);

    await Developer.findByIdAndDelete(user._id);

    const response = await request(app)
      .post(`/v1/developers/${likeUser._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .send();

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Developer not exists',
    });
  });

  it('should not be able to like an user that not exists', async () => {
    const [user, likeUser] = await factory.createMany('Developer', 2);
    const token = jwtoken(user.id);

    await Developer.findByIdAndDelete(likeUser._id);

    const response = await request(app)
      .post(`/v1/developers/${likeUser._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .send();

    expect(response.body).toMatchObject({
      error: 'Bad Request',
      message: 'Developer not exists',
    });
  });

  it('should be able to emit a match to users', async () => {
    const user = await factory.create('Developer');
    const matchUser = await factory.create('Developer', {
      likes: [user._id.toString()],
    });
    const token = jwtoken(user.id);

    const userSocketId = faker.number.int();
    const matchUserSocketId = faker.number.int();

    connect({
      id: userSocketId,
      handshake: {
        query: {
          developer_id: user._id,
        },
      },
    });

    connect({
      id: matchUserSocketId,
      handshake: {
        query: {
          developer_id: matchUser._id,
        },
      },
    });

    await request(app)
      .post(`/v1/developers/${matchUser._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(to).toHaveBeenNthCalledWith(1, userSocketId.toString());
    expect(emit).toHaveBeenNthCalledWith(1, 'match', matchUser.toObject());

    expect(to).toHaveBeenNthCalledWith(2, matchUserSocketId.toString());
    expect(emit).toHaveBeenNthCalledWith(2, 'match', user.toObject());
  });
});
