jest.mock('redis', () => {
  const redis = jest.requireActual('redis-mock');

  const client = redis.createClient();
  client.get = async (key) => {
    return new Promise((resolve) => {
      redis.createClient().get(key, (err, val) => {
        resolve(val);
      });
    });
  };
  client.connect = jest.fn();

  return {
    ...redis,
    createClient() {
      return client;
    },
  };
});
