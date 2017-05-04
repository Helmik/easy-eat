'use strict';
var  fs = require('fs');
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

function createDirectory(path, dirName) {
  if(!fs.existsSync(path + dirName)) {
    fs.mkdirSync(path + dirName);
    console.log("Created " + path + dirName);
  }
}
let baseURL = './server/';
let directory = {
  storage: {
    places: null
  }
}


function fetchDirectories(tree, path) {
  if(tree) {
    for(let key in tree) {
      createDirectory(path,  key);
      fetchDirectories(tree[key], path + key + '/');
    }
  }
}

fetchDirectories(directory, baseURL);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    app.setMaxListeners(0);
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
