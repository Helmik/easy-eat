'use strict';
var data = require('./database/index.js')
/**
 * Created by developeri on 4/10/17.
 */
module.exports = function(app) {
  console.log("Create models start...");
  // Get all models
  var props = {
    all_models: require('../model-config.json'),
    exclude: ['User', '_meta']
  };
  // Get model's key
  var getModels = function() {
    return Object.keys(props.all_models).filter(function(current) {return props.exclude.indexOf(current) < 0});
  }
  // Get mysql connection
  const mysql = app.dataSources.mySqlDb;
  mysql.isActual(getModels(), function(error, actual) {
    if (error) throw error;
    if (!actual) {
      mysql.autoupdate(function(error, result) {
        if (error) throw error;
        data(app);
        console.log("Models created ", result);
      });
    }
  });
}
