const { MongoMemoryServer } = require('mongodb-memory-server');
const os = require('os');

console.log(os.arch());
console.log(os.platform());
console.log(os.version());

module.exports = async () => {
  const mongod = await MongoMemoryServer.create();

  process.env.MONGO_URL = mongod.getUri();
  global.__MONGOD__ = mongod;
};
