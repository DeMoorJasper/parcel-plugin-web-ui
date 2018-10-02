const Bundler = require('parcel-bundler');
const path = require('path');
const WebUIPlugin = require('../src/main');

async function run() {
  const bundler = new Bundler(path.join(__dirname, './index.html'), {
    outDir: path.join(__dirname, 'dist'),
    watch: true,
    cache: false,
    hmr: false,
    logLevel: 0,
    publicUrl: './'
  });

  await WebUIPlugin(bundler);
  await bundler.serve(1234, true);
}

run();
