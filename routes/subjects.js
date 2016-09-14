/**
 * Created by kirill on 17.2.16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');


var mongoose = require('mongoose');
var Test = require('../models/Test.js');

router.get('/',passport.authenticate('jwt', { session: false}), function(req, res, next){
    var query = Test.find({}).select('info.subject -_id');
    query.exec(function(err, value){
        var subjects = [];
        var old_subjects = [];
        var result = [];

        if (err) return next(err);
        for(var i=0; i < value.length; i++){
            old_subjects.push(value[i].info.subject);
            if (subjects.indexOf(value[i].info.subject) === -1){
                subjects.push(value[i].info.subject);
            }
        }
        for(var i=0; i < subjects.length; i++){

            var obj = old_subjects.filter(function ( obj ) {
                return obj === subjects[i];
            });
            result.push({subject: subjects[i], count:obj.length});
        }
        res.json(result);
    });
});

router.get('/:subject', function(req, res, next){
   Test.find({'info.subject':req.params.subject}, function(err, result){
       if (err) return next(err);
       var last_update = result[0].updated_at;
       for (var i=0; i < result.length; i++){
           if (result[i].updated_at > last_update){
               last_update = result[i].updated_at;
           }
       }
       var jsonToSend = {name:req.params.subject, data: result, last_update: last_update};
       res.json(jsonToSend);
   });
});


module.exports = router;
