import { findConnection, emit } from '../../websocket';

class MatchDevelopers {
  async execute({ developer, likedDeveloper }) {
    if (likedDeveloper.likes.includes(developer._id)) {
      const devSocketId = await findConnection(developer._id);
      const likedDevSocketId = await findConnection(likedDeveloper._id);

      if (devSocketId) {
        emit(devSocketId, 'match', likedDeveloper.toObject());
      }

      if (likedDevSocketId) {
        emit(likedDevSocketId, 'match', developer.toObject());
      }
    }
  }
}

export default MatchDevelopers;
