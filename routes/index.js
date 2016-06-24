/**
 * Created by kirill on 17.2.16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});
module.exports = router;
