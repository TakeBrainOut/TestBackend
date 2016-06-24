/**
 * Created by kirill on 25.3.16.
 */
var express = require('express');
var router = express.Router();
var passport	= require('passport');

var User = require('../models/User.js');

router.get('/',passport.authenticate('jwt', { session: false}), function(req, res, next) {
    User.find(function(err, users){
        if (err) return next(err);
        res.json(users);
    });
});

router.put('/:id',passport.authenticate('jwt', { session: false}), function (req, res, next){
    User.findOneAndUpdate({_id: req.params.id}, req.body, function (err, post){
        if (err) return next(err);
        res.json(post);
    });
});


module.exports = router;
