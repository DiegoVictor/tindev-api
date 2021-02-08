import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.github.com',
});

class GithubUser {
  execute({ user }) {
    return api.get(`users/${user}`);
  }
}

export default GithubUser;
