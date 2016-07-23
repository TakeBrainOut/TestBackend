/**
 * Created by kirill on 15.2.16.
 */
var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
    info: {
        type: {
            subject:{
                type: String,
                required: true
            },
            var:{
                type: String,
                required: true,
            },
            year:{
                type: String,
                required:true,
            }
        },
        unique: true
    },
    updated_at: Date,
    questions: [{
        number:{
            type: String,
            required: true,
        },
        text:{
            type: String,
            required: true
        }, answ: [
            {
                text: String,
                isCorrect: Boolean
            }
        ]}],
    note: String
});

module.exports = mongoose.model('Test', TestSchema);