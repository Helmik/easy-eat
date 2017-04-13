'use strict';

module.exports = function(Product) {
  Product.addPrice = function(productName, price, next) {
    Product.findOne({where: {name: productName}}, function(error, product){
      if (error) return next(error);
      console.log(product);
      price.productId = product.id;
      product.prices.create(price).then((price) => {
        console.log(price);
        next(null, price)
      }).catch((error) => {
        console.log(error);
        next(error);
      });
    });
  };
  Product.remoteMethod('addPrice', {
    accepts: [{arg: 'productName', type: 'string', required: true},
      {arg: 'price', type: 'object', required: true}],
    returns: {root: true, type: 'object'},
    http: {path: '/addPrice', verb: 'post'}
  });
};
