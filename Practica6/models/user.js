/**
 * Definicion del esquema de un usuario o user
 */
var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var userSchema = new mongoSchema({
    "username" : String,
    "password" : String,
});

module.exports = mongoose.model('user',userSchema);