/**
 * Created by kirill on 10.3.16.
 */

var JwtStrategy = require('passport-jwt').Strategy;

// load up the user model
var User = require('../models/User');
var config = require('../config/database');

var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    passReqToCallback: false
};
module.exports = function(passport) {
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};