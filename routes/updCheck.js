/**
 * Created by kirill on 26.06.16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Test = require('../models/Test.js');


router.post('/', function (req, res, next) {
    var req_body = [];
    if (Array.isArray(req.body)) {
        req_body = req.body;
    }
    else {
        req_body = new Array(req_body);
    }
    // var result = [];
    // if (req_body != undefined) {
    //
    //     req_body.forEach(function (item, i, array) {
    //         Test.find({"info.subject": item.subject, updated_at: {$gt: item.last_update}}).count(function (err, count) {
    //             console.log(item);
    //
    //             if (err) return next(err);
    //             if (count > 0) {
    //                 var resObj = {"subj": item.subject, "count": count, "update": item.last_update};
    //                 result.push(resObj);
    //
    //
    //                 if (i == (array.length - 1)) {
    //                     console.log(result);
    //                     res.json(result);
    //                 }
    //             }
    //             else {
    //                 res.json([]);
    //             }
    //         });
    //
    //     });
    // }
    // else {
    //     res.json([]);
    //
    // };
    req_body.forEach(function (item, i, array) {
        // var time = item.last_update;
        // time.setMilliseconds(time.getMilliseconds());

        var time = new Date(item.last_update);
        time.setMilliseconds(time.getMilliseconds() + 100000000);

        Test.find({
            "info.subject": item.subject
        })
            .where("updated_at")
            .gt(time)
            .exec(function (err, result) {
                console.log(result);
                // console.00log("%%%%%%%%%%%%%%%%%SEARCH" + item.last_update.getMilliseconds() + " +++++++++++++++++++++++++++++RESULT" + result[0].updated_at.getMilliseconds());
            });


    });
    res.json([]);

});

module.exports = router;
