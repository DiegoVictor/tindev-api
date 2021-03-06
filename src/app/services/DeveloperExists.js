import { badRequest } from '@hapi/boom';

import Developer from '../models/Developer';

class DeveloperExists {
  async execute({ id }) {
    const user = await Developer.findById(id);
    if (!user) {
      throw badRequest('Developer not exists', { code: 240 });
    }

    return user;
  }
}

export default DeveloperExists;
