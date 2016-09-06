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

  var jsonToSend = [];

  req_body.forEach(function (item, number, array) {

    Test.find({'info.subject': item.subject}).where('updated_at').gt(item.last_update).exec(function (err, result) {
      if (err) return next(err);
      var last_update = result[0].updated_at;
      for (var i = 0; i < result.length; i++) {
        if (result[i].updated_at > last_update) {
          last_update = result[i].updated_at;
        }
      }
      var jsonItem = {name: item.subject, data: result, last_update: last_update};
      jsonToSend.push(jsonItem);

      if (number == (array.length - 1)) {
        res.json(jsonToSend);
      }


    });
  });
});

module.exports = router;