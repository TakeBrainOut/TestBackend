/**
 * Created by kirill on 17.2.16.
 */
var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res, next) {
    var name = req.params.name;
    res.render('partials/' + name);
});

module.exports = router;

