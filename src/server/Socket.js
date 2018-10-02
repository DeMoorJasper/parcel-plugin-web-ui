const WebSocket = require('ws');

class Socket {
  constructor(options) {
    this.port = options.socketPort;
    this.bundler = options.bundler;
    
    this.server = null;
  }

  start() {
    this.server = new WebSocket.Server({
      port: this.port
    });

    this.initSocket();
    
    return this.server;
  }

  handleClientRequest(ws, msg) {
    try {
      let messageJSON = JSON.parse(msg);
      if (messageJSON.type === 'request') {
        if (messageJSON.identifier === 'project-data') {
          let response = {
            type: 'response',
            identifier: 'project-data',
            data: {
              options: this.bundler.options,
              status: 'watching'
            }
          };
          ws.send(JSON.stringify(response));
        }
      }
    } catch(e) {}
  }

  handleSocketError(err) {
    if (err.error.code === 'ECONNRESET') {
      // This gets triggered on page refresh, ignore this
      return;
    }
    logger.warn(err);
  }

  initSocket() {
    this.server.on('connection', ws => {
      ws.on('message', message => {
        this.handleClientRequest(ws, message);
      });
      ws.onerror = this.handleSocketError;
      console.log('Client connected to websocket.');
    });

    this.server.on('error', this.handleSocketError);
  }
}

module.exports = Socket;