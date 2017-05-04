'use strict';
var  fs = require('fs');
module.exports = function(Place) {
  Place.beforeRemote('create', (ctx, modelInstance, next) => {
    let placeId = ctx.result.id;
    let path = './server/storage/places/' + placeId;
    if(!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    next();
  });
};
