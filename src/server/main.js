const Server = require('./Server');
const Socket = require('./Socket');

async function startServer(options) {
  let server = new Server(options);
  await server.start();

  console.log('Server listening on port', options.serverPort);

  let socket = new Socket(options);
  await socket.start();

  console.log('Socket listening on port', options.socketPort);
}

module.exports = startServer;