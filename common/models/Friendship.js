'use strict';

module.exports = function(Friendship) {
  Friendship.sendMail = function(name, friend, cb) {
    var contentMessage = '<h1>Hello ' + name + '!</h1><p>' + friend + ' wants to get connecti with you in easy eat</p>';
    /*var myMessage = {name: name, friend: friend};
    // prepare a loopback template renderer
    var url = '../common/views/mail/request-friendship.ejs';
    var __dirName, htmlBody;
    var renderer = Friendship.template(required(url));
    htmlBody = renderer(myMessage);*/
    // send email using Email model of Loopback
    Friendship.app.models.Email.send({
      to: 'helmik.test@gmail.com',
      from: 'no-reply@gmail.com',
      subject: 'Easy food invitation',
      html: contentMessage,
    }, function(err, mail) {
      if (err) return err;
      console.log('email sent!');
      cb();
    });
  };
  Friendship.remoteMethod('sendMail', {
    accepts: [{arg: 'name', type: 'string', required: true},
              {arg: 'friend', type: 'string', required: true}],
    http: {path: '/senadMail', verb: 'post'}
  });
};
