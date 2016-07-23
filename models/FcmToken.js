/**
 * Created by kirill on 30.06.16.
 */
var mongoose = require('mongoose');
var TokenShema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('FcmToken', TokenShema);
