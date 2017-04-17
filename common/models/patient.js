'use strict';

module.exports = function(Patient) {
  Patient.observe('before save', (ctx, next) => {
    if(ctx.isNewInstance){
      ctx.instance.created = new Date();
    } else {
      ctx.data.updated = new Date();
    }
    next();
  })
};
