/**
 * Created by kirill on 26.06.16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Test = require('../models/Test.js');
var async = require('async');


router.post('/',passport.authenticate('jwt', { session: false}), function (req, res, next) {
    var req_body = [];
    if (Array.isArray(req.body)) {
        req_body = req.body;
    }
    else {
        req_body = new Array(req_body);
    }
    var result = [];
    if (req_body != undefined) {
        async.map(req_body, function(item, next){
          Test.find({"info.subject": item.subject, updated_at: {$gt: item.last_update}}).count(function (err, count) {
              var resObj = {"subj": item.subject, "count": count, "update": item.last_update};
              next(err, resObj);
          });
        },
        function(err, result){
          if (err) return next(err);
          console.log(result);

          res.json(result.filter(function(item){
            return item.count > 0;
          }));
        });
    }
    else {
        res.json([]);

    };
});

module.exports = router;
