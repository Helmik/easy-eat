'use strict';
//var data = require('./catStatus.json');
/**
 * Created by developeri on 4/10/17.
 */
module.exports = function(app) {
  var RoleMapping = app.models.RoleMapping;
  var data = [];
  // Get data to save
  data.push(require('./Role.json'));
  data.push(require('./catStatus.json'));
  data.push(require('./user.json'));
  data.push(require('./CatRequestStatus.json'));
  var saveData = function(model, data) {
    // Define a promise
    return new Promise(function(resolve, rejected) {
      // Count the data in table
      model.count().then(function(count) {
        if (count <= 0) {
          // Fill table
          resolve(model.create(data));
        } else {
          resolve('Table has data already.');
        }
      }).catch(function(error) {
        rejected(error);
      });
    });
  };
  var models = app.models;
  var promises = [];
  data.map(function(model) {
    promises.push(saveData(models[model.model], model.data));
  });
  Promise.all(promises).then(function(response) {
    setTimeout(function(){
      console.log('Data inserted', response);
      // Relationships between customers and roles
      var relationships = [
        {role: 'Admin', username: 'admin'},
        {role: 'Customer', username: 'helmik'},
        {role: 'Customer', username: 'escamilla'},
        {role: 'Customer', username: 'torres'},
      ];
      relationships.forEach(function(relationship) {
        var queryRole = {where: {name: relationship.role}};
        models.Role.findOne(queryRole, function(err, role) {
          if (err) throw err;
          var queryName = {where: {username: relationship.username}};
          models.User.findOne(queryName, function(err, user) {
            if (err) throw err;
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: user.id,
            });
          });
        });
      });
    },500);
  }).catch(function(error) {
    console.log(error);
  });
};
