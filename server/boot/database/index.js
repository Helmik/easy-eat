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
    console.log('Data inserted', response);
    // Relationships between customers and roles
    var relationships = [
      {role: 'Admin', username: 'admin'},
    ];
    relationships.forEach(function(relationship) {
      var queryRole = {where: {name: relationship.role}};
      console.log(queryRole);
      models.Role.find(queryRole, function(err, role) {
        if (err) throw err;
        var queryName = {where: {username: relationship.username}};
        models.User.find(queryName, function(err, user) {
          if (err) throw err;
          role.pop().principals.create({
            principalType: RoleMapping.USER,
            principalId: user.pop().id,
          });
        });
      });
    });
  }).catch(function(error) {
    console.log(error);
  });
};
