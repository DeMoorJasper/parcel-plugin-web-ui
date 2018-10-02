const server = require('./server/main');

module.exports = async function (bundler) {
  await server({
    socketPort: 8001,
    serverPort: 8000,
    bundler
  });
};
