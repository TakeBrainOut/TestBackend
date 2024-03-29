/**
 * Created by kirill on 30.06.16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var FcmToken = require('../models/FcmToken');

var unirest = require("unirest");
var notifReq = unirest("POST", "https://fcm.googleapis.com/fcm/send");
notifReq.headers({
    "cache-control": "no-cache",
    "content-type": "application/json",
    "authorization": "key=AIzaSyAnvj4NDx2qVum_4N8NP5kEd2o5qNIzhj4"
});


router.post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    FcmToken.find(function (err, resTokens) {
        if (err) return next(err);

        for (var i = 0; i < resTokens.length / 1000; i++){
           var slicedTokens = resTokens.slice(i * 1000, (i+1) * 1000);
            var tokenArray = [];
            for (var j = 0; j < slicedTokens.length; i++) {
                tokenArray.push(slicedTokens[j].token);
            }
            notifInfo = req.body;
            notifReq.send(
                {
                    "registration_ids": tokenArray,
                    "notification": {
                        "body": notifInfo.text,
                        "title": notifInfo.title,
                        "icon": "myIcon",
                        "sound": "mySound"
                    }
                }
            );

            notifReq.end(function (response) {
                res.json(response.body);
            }, function (error) {
                return next(error);
            });

        };
    });
});


module.exports = router;

