'use strict';
var md5 = require('md5');
module.exports = function(Friendship) {
  function generateToken(value1, value2){
    return md5(String(value1) + String(value2));
  }
  Friendship.sendRequest = function(customerId, customerId2, next) {
    var customers = [];
    customers.push(Friendship.models.Customer.findOne({
      where: {id: customerId},
    }));
    customers.push(Friendship.models.Customer.findOne({
      where: {id: customerId2},
    }));
    Promise.all(function(err, data) {
      if (err) {
        console.log(err);
        next(err);
      }
      var friendshipQuery = {
        were: {
          or: [
            {
              and:[
                { customerId: customerId },
                { customerId2: customerId2 }
              ]
            },
            {
              and: [
                { customerId: customerId2 },
                { customerId2: customerId }
              ]
            }
          ]
        }
      };
      Friendship.findOne(friendshipQuery).then(friendship => {
        if(!friendship) {
          console.log("Adding friendship...");
          var token = generateToken(customerId, customerId2);
          Friendship.create({
            customerId,
            customerId2,
            catRequestStatus: 1,
            token
          }).then( friendshipCreated => {
            var contentMessage = '<h1>Hello ' + name + '!</h1><p>' +
              friend + ' wants to get connecti with you in easy eat</p>';
            Friendship.app.models.Email.send({
              to: 'helmik.test@gmail.com',
              from: 'no-reply@gmail.com',
              subject: 'Easy food invitation',
              html: contentMessage,
            }, function(err, mail) {
              if (err) return err;
              console.log('email sent!');
              next(null, mail);
            });
          }).catch(error => {
            next(error);
          });
        }
      }).catch(error => {
        console.log(error);
        next(error);
      });
    }).catch(error => {
      console.log(error);
      next(error);
    });
    /**/
  };
  Friendship.remoteMethod('sendRequest', {
    accepts: [{arg: 'name', type: 'string', required: true},
              {arg: 'friend', type: 'string', required: true}],
    http: {path: '/senadMail', verb: 'post'}
  });
};
