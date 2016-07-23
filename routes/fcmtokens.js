/**
 * Created by kirill on 30.06.16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var FcmToken = require('../models/FcmToken');


router.post('/new', function (req, res, next) {

    var token = new FcmToken({token: req.body.token});
    FcmToken.create(token, function (err, post) {
        if (err) return next(err);
        res.json({"created": true});
    });
});

module.exports = router;

