'use strict';
var md5 = require('md5');
module.exports = function(Friendship) {
  function generateToken(value1, value2){
    let timestamp =  String(+new Date()).split('').reverse().join('');
    return timestamp+md5(String(value1) + String(value2));
  }
  Friendship.sendRequest = function(customerId, customer2Id, next) {
    var customers = [];
    customers.push(Friendship.app.models.Customer.findOne({
      include: ['user'],
      where: {id: customerId},
    }));
    customers.push(Friendship.app.models.Customer.findOne({
      include: ['user'],
      where: {id: customer2Id},
    }));
    Promise.all(customers).then( customerUser => {
      if(!customerUser[0]) {
        next('The user does not exist.');
      }
      if(!customerUser[1]){
        next('To invite someone, it must been registered.');
      }
      console.log(customerUser);
      var friendshipQuery = {
        where: {
          or: [
            {
              and:[
                { customerId: customerId },
                { customer2Id: customer2Id }
              ]
            },
            {
              and: [
                { customerId: customer2Id },
                { customer2Id: customerId }
              ]
            }
          ]
        }
      };
      Friendship.findOne(friendshipQuery).then(friendship => {

        if(!friendship) {
          var token = generateToken(customerId, customer2Id);
          Friendship.create({
            customerId,
            customer2Id,
            catRequestStatusId: 2,
            token
          }).then( friendshipCreated => {
            var contentMessage = '<h1>Hello ' + customerUser[0].user().firstName + '!</h1><p>' +
                customerUser[1].user().firstName + ' wants to get connecti with you in easy eat</p>'+
                'click in this <a href="http://localhost:3000/api/Friendships/accept?token=' + token + '" target="_blank">link</a>';
            Friendship.app.models.Email.send({
              to: 'helmik.test@gmail.com',
              from: 'no-reply@gmail.com',
              subject: 'Easy food invitation',
              html: contentMessage,
            }, function(err, mail) {
              if (err) return err;
              next(null, friendshipCreated);
            });
          }).catch(error => {
            console.log("Error on create friendship", error);
            next(error);
          });
        } else {
          console.error("Friendship already exist");
          next("Friendship already exist");
        }
      }).catch(error => {
        console.error("Error on search relationship", error);
        next(error);
      });
    }).catch(error => {
      console.error("Error on search customers", error);
      next(error);
    });
  };
  Friendship.accept = (token, next) => {
    console.log(token);
    Friendship.findOne({where: {token,}}).then(friendship => {
      if(friendship){
        friendship.catRequestStatusId = 3;
        Friendship.upsert(friendship).then(success => {
          next(null,success);
        })
      } else {
        next('The friendship request does not exist');
      }
    });
  };
  /**
   *
   * Remote methods
   *
   **/
  Friendship.remoteMethod('sendRequest', {
    accepts: [{arg: 'customerId1', type: 'number', required: true},
              {arg: 'customer2Id', type: 'number', required: true}],
    http: {path: '/sendRequest', verb: 'post'},
    returns: {root: true, type: 'object'},
  });
  Friendship.remoteMethod('accept', {
    accepts: [{arg: 'token', type: 'string', required: true}],
    http: {verb: 'get'},
    returns: {root: true, type: 'object'},
  });
};
