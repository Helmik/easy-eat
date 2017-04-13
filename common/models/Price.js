'use strict';

module.exports = function(Price) {
  Price.newFunction = function() {
    console.log('Hello, new function');
  };
};
