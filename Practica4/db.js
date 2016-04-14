/**
 * Este fichero contiene las funciones encargadas de realizar operaciones con
 * la base de datos
 */

'use strict';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');

var uri = 'mongodb://127.0.0.1:27017/tareator';

/**
 * Inserta la tarea con los campos especificados como parametro en la base de datos.
 * Despues, invoca la funcion callback con el resultado
 */
function insertMemo(texto, fecha, fichero, nombre, callback){
    MongoClient.connect(uri,function(err,connection){

        var collection = connection.collection('memos');
        if(fichero == null) {
            collection.insert({
                'texto': texto,
                'fecha': fecha,
                'fichero': fichero,
                'nombreFichero': nombre
            }, function (err) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('Tarea subida con exito');
                }
                connection.close();
                callback(err);
            });
        } else{
            collection.insert({
                'texto': texto,
                'fecha': fecha,
                'fichero': fichero,
                'nombreFichero': nombre
            }, function (err) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('Tarea subida con exito');
                }
                connection.close();
                callback(err);
            });
        }
    });
}

/**
 * Obtiene todas las tareas de la base de datos, y despues llama a la funcion
 * callback con el resultado
 */
function getAllMemo(callback){
    MongoClient.connect(uri,function(err,connection){

        var collection = connection.collection('memos');

        collection.find().toArray(function(err,documents){
            if(!err) console.log("Obtenidas todas las tareas");
            connection.close();
            callback(err,documents);
        });
    });
}

/**
 * Obtiene la tarea cuyo id es el pasado como parametro, y llama a la funcion
 * callback con el resultado
 */
function getMemo(id, callback){

    MongoClient.connect(uri,function(err,connection){

        var collection = connection.collection('memos');

        collection.findOne({'_id': new ObjectID(id)},function(err,row){
            if(!err) console.log("Obtenidas tarea con id " + id);
            connection.close();
            callback(err,row);
        });
    });
}

/**
 * Elimina la tarea cuyo id es el pasado como parametro, y despues llama a la funcion
 * callback con el resultado
 */
function deleteMemo(id, callback){

    MongoClient.connect(uri,function(err,connection){

        var collection = connection.collection('memos');

        collection.remove({'_id': new ObjectID(id)},function(err){
            if(!err) console.log("Eliminada la tarea con id " + id);
            connection.close();
            callback(err);
        });
    });
}

/**
 * Obtiene el fichero y el nombre del fichero de la tarea cuyo id es el pasado
 * como parametro, y despues llama a la funcion callback con el resultado
 */
function getBlob(id, callback){
    MongoClient.connect(uri,function(err,connection){

        var collection = connection.collection('memos');

        collection.findOne({'_id': new ObjectID(id)},function(err,row){
            if(!err) console.log("Obtenidas tarea con id " + id);
            connection.close();
            callback(err,row);
        });
    });
}

/**
 * Con los parametros usuario/contraseña, comprueba primero si el usuario existe.
 * Si no existe, lo inserta en la base de datos. Si existe, comprueba que la
 * contraseña (encriptada) se corresponde a la almacenada.
 * Despues, invoca a la funcion callback con los resultados
 */
function login(username, password, callback) {
    if (username != null) {
        MongoClient.connect(uri, function (err, connection) {

            var collection = connection.collection('users');

            collection.findOne({'username': username}, function (err, row) {
                if (row == undefined) {

                    /* Nuevo usuario */

                    bcrypt.hash(password, 10, function (err, hash) {
                        collection.insert({'username': username, 'password': hash}, function (err) {
                            connection.close();
                            callback(err, true, hash);
                        });
                    });
                } else {

                    /* Usuario existente */
                    bcrypt.compare(password, row.password, function (err, res) {
                        connection.close();
                        callback(err, res, row.password);
                    })
                }
            });
        });
    } else{
        callback(true,null,null);
    }
}

/**
 * Comprueba si la pareja usuario/contraseña pasada como parametro se corresponde a la
 * insertada en la base de datos
 */
function checkLogged(username,password,callback){
    if(username != null){
        MongoClient.connect(uri,function(err,connection){

            var collection = connection.collection('users');

            collection.findOne({'username': username}, function(err,row){
                if(row == undefined){
                    connection.close();
                    callback(false);
                } else{
                    connection.close();
                    callback(row.username == username && row.password == password);
                }
            });
        });
    } else{
        callback(false);
    }
}

exports.insertMemo = insertMemo;
exports.getAllMemo = getAllMemo;
exports.getMemo = getMemo;
exports.deleteMemo = deleteMemo;
exports.getBlob = getBlob;
exports.login = login;
exports.checkLogged = checkLogged;
