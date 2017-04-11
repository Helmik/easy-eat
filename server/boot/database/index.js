'use strict';
//var data = require('./catStatus.json');
/**
 * Created by developeri on 4/10/17.
 */
module.exports = function(app) {
  var data = [];
  data.push(require('./catStatus.json'));
  data.push(require('./user.json'));
  var saveData = function(model, data) {
    // Define a promise
    return new Promise(function(resolve, rejected) {
      // Count the data in table
      model.count().then(function(count) {
        if (count <= 0) {
          // resolve(model.create(data.data));
          //data.data.map(function(obj){

          //});
          resolve(model.create(data));
        } else {
          rejected('Table has data already.');
        }
      }).catch(function(error) {
        rejected(error);
      });
    });
  };
  var models = app.models;
  data.map(function(d) {
    saveData(models[d.model], d.data).then(function(response) {
      console.log('Data inserted', response);
    }).catch(function(error) {
      console.log(error);
    });
  });
};
