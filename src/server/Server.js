const http = require('http');
const url = require('url');
const path = require('path');
const mime = require('mime-types');
const contentType = require('content-type');
const fs = require('fs-extra');

class Server {
  constructor(options = {}) {
    this.port = options.serverPort;
    this.optionsObject = {
      socketPort: options.socketPort
    };
    this.bundler = options.bundler;

    this.server = null;
  }

  async handleRequest(req, res) {
    let parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    let mimeType = mime.lookup(path.extname(pathname));
    res.setHeader('Content-Type', contentType.format({
      type: mimeType
    }));

    if (pathname === '/options.json') {
      res.writeHead(200);
      res.end(JSON.stringify(this.optionsObject));
      return;
    }

    let filePath = path.join(__dirname, '../../ui-build', pathname);
    if (await fs.exists(filePath)) {
      res.writeHead(200);
      fs.createReadStream(filePath).pipe(res);

      console.log('Sending:', pathname);
    } else {
      res.writeHead(404);
      res.end('Not found.');
      
      console.error('Not found:', pathname);
    }
  }

  async start() {
    if (this.server) {
      return;
    }

    this.server = http.createServer(this.handleRequest);
    this.server.listen(this.port);

    return new Promise((resolve, reject) => {
      this.server.once('error', reject);
      this.server.once('listening', () => resolve(this.server));
    });
  }
}

module.exports = Server;