/**
 * Created by kirill on 11.3.16.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var jwt = require('jwt-simple');
var config = require('../config/database');

router.post('/', function(req, res){
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        }
        else if (!user.isConfirmed){
            res.send({success: false, msg: 'Пользователь не подтвержден'});
        }
        else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

router.use(function(req, res, next){

});
module.exports = router;
