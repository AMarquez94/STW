/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para la coleccion users
 */
module.exports = function(app){

    var user = require('../models/user.js');

    /* GET /users */
    findAllUsers = function(req,res){
        var response = {};
        user.find(function(err,data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* GET /users/:id */
    findById = function(req,res){
        var response = {};
        user.findById(req.params.id, function(err, data){
            if(err){
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* POST /users */
    addUser = function(req, res){
        var newUser = new user();
        var response = {};
        newUser.password = req.body.password;
        newUser.username = req.body.username;
        newUser.save(function(err){
            if(err){
                response = {"error" : true, "message" : "Error adding data"};
            } else{
                response = {"error" : false, "message" : "Data added"};
            }
            res.json(response);
        });
    };

    /* PUT /users/:id */
    updateUser = function(req,res){
        var response = {};
        user.findById(req.params.id,function(err,data){
            if(req.body.password !== undefined){
                data.password = req.body.password;
            }
            if(req.body.username !== undefined){
                data.username = req.body.username;
            }

            data.save(function(err){
                if(err){
                    response = {"error" : true, "message" : "Error updating data"};
                } else{
                    response = {"error" : false, "message" : "Data is updated for " + req.params.id};
                }
                res.json(response);
            });
        });
    };

    /* DELETE /users */
    deleteAllUsers = function(req,res){
        var response = {};

        user.remove({}, function(err){
            if(err){
                response = {"error" : true, "message" : "Error deleting data"};
            } else{
                response = {"error" : false, "message" : "All users deleted"};
            }
            res.json(response);
        });
    };

    /* DELETE /users/:id */
    deleteUser = function(req,res){
        var response = {};
        user.findById(req.params.id, function(err,data){
            if(err){
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                user.remove({_id : req.params.id}, function(err){
                    if(err){
                        response = {"error" : true, "message" : "Error deleting data"};
                    } else{
                        response = {"error" : false, "message" : "Data associated with " + req.params.id + "is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    };

    app.get('/users', findAllUsers);
    app.get('/users/:id', findById);
    app.post('/users', addUser);
    app.put('/users/:id',updateUser);
    app.delete('/users/:id',deleteUser);
    app.delete('/users', deleteAllUsers);
};