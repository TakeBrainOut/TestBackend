var express = require('express');
var router = express.Router();
var passport	= require('passport');

var mongoose = require('mongoose');
var Test = require('../models/Test.js');

router.get('/', function(req, res, next) {
  Test.find({}).lean().exec(function (err, tests) {
    if (err) return next(err);
      for (var i = 0; i < tests.length; i++){
        tests[i].questions = tests[i].questions.length;
      }
      res.json(tests);
  })
  });

router.post('/',passport.authenticate('jwt', { session: false}), function(req, res, next){
  req.body.updated_at = Date.now();
  Test.create(req.body, function (err, post){
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/:id',passport.authenticate('jwt', { session: false}), function (req, res, next){
  Test.findById(req.params.id, function(err, post){
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id',passport.authenticate('jwt', { session: false}), function (req, res, next){
  req.body.updated_at = Date.now();
  Test.findByIdAndUpdate(req.params.id, req.body, function (err, post){
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id',passport.authenticate('jwt', { session: false}), function (req, res, next){
  Test.findByIdAndRemove(req.params.id, req.body, function (err, post){
    if (err) return next(err);
    res.json(post);
  });
});
module.exports = router;
