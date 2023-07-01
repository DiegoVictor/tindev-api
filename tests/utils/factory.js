import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

import Developer from '../../src/app/models/Developer';

factory.define('Developer', Developer, {
  name: faker.person.firstName,
  user: faker.internet.userName,
  bio: faker.lorem.paragraph,
  avatar: faker.image.url,
  likes: [],
  dislikes: [],
});

export default factory;
