const WebSocket = require('ws');

class Socket {
  constructor(options) {
    this.port = options.socketPort;
    this.bundler = options.bundler;
    
    this.server = null;

    this.bundlerBuilding = false;
  }

  start() {
    this.server = new WebSocket.Server({
      port: this.port
    });

    this.initSocket();
    
    return this.server;
  }

  generateProjectData() {
    let projectData = {};

    // projectData.options = this.bundler.options;
    projectData.status = 'watching';

    if (this.bundler.server) {
      let parcelServer = this.bundler.server;
      projectData.previewUrl = `${parcelServer.key && parcelServer.cert ? 'https' : 'http'}://localhost:${parcelServer.address().port}`;
    }

    return projectData;
  }

  handleClientRequest(ws, msg) {
    try {
      let messageJSON = JSON.parse(msg);
      if (messageJSON.type === 'request') {
        if (messageJSON.identifier === 'project-data') {
          ws.send(JSON.stringify({
            type: 'response',
            identifier: 'project-data',
            data: this.generateProjectData()
          }));
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