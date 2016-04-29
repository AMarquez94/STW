/**
 * Inicia la API, que escuchara en el puerto 3000
 */

function startAPI() {
    var express = require("express");
    var app = express();
    var http = require("http");
    var server = http.createServer(app);
    var bodyParser = require("body-parser");
    var mongoose = require("mongoose");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({"extended" : false}));
    require('./routes/users')(app);
    require('./routes/memos')(app);
    require('./routes/index')(app);

    mongoose.connect('mongodb://localhost:27017/tareator', function(err,res){
        if(err){
            console.log("Error conectando a la BD");
        } else{
            console.log("Conectado a la BD");
        }
    });

    console.log("API escuchando en el puerto 3000");
    server.listen(3000);
}

exports.startAPI = startAPI;

