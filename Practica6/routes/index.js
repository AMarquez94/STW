var path = require('path');

/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para las operaciones distintas a usuarios y memos
 */
module.exports = function(app){

    sendIndex = function(req,res){
        res.sendFile(path.resolve('./public/index.html'));
    };

    sendCore = function(req,res){
        res.sendFile(path.resolve('./public/core.js'));
    };

    app.get('/', sendIndex);
    app.get('/core.js', sendCore);
};