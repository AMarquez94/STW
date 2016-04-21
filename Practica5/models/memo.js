/**
 * Definicion del esquema de una tarea o memo
 */

var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var memoSchema = new mongoSchema({
    "texto" : String,
    "fecha" : String,
    "fichero" : String,
    "nombreFichero" : String
});

module.exports = mongoose.model('memo',memoSchema);
