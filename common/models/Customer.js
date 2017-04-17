'use strict';

module.exports = function(Customer) {
    Customer.beforeRemote( 'create', ( ctx, modelInstance, next) => {
        if(ctx.req.body.userId) {
            Customer.findOne({where: {userId: ctx.req.body.userId}}).then(customer => {
                next();
                if(!customer) {
                    next();
                } else {
                    next("The uer has an customer already");
                }
            })
        } else {
            next("userId is required");
        }
    });
    Customer.afterRemote( 'create', ( ctx, modelInstance, next) => {
        Customer.app.models.user.findOne({where: {id: ctx.result.userId}}).then(user => {
            user.customerId = ctx.result.id;
            if(user) {
                user.replaceAttributes(user, function(err, obj){
                    if(err) {
                        console.log("1", err);
                        return next(err);
                    }
                    next();
                })
            }
        }).catch(err => {
            console.log("2", err);
            next(err);
        });
        /*Customer.app.models.user.upsertWithWhere(
            {where: {id: ctx.result.userId}},
            {customerId: ctx.result.id},
            function(err, obj){
                if(err) return next(err);
                next();
            }
        );*/
    });
};
