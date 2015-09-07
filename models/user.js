var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

// Build a model from the alarm schema
module.exports = mongoose.model('User', userSchema);