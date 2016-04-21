/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para la coleccion memos
 */

module.exports = function(app){

    var memo = require('../models/memo.js');

    /* GET /memos */
    findAllMemos = function(req,res){
        var response = {};
        memo.find(function(err,data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* GET /memos/:id */
    findById = function(req,res){
        var response = {};
        memo.findById(req.params.id, function(err, data){
            if(err){
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* POST /memos */
    addMemo = function(req, res){
        var newMemo = new memo();
        var response = {};
        if(req.body.nombreFichero != null){
            newMemo.nombreFichero = req.body.nombreFichero;
            newMemo.fichero = req.body.fichero;
        }
        newMemo.fecha = req.body.fecha;
        newMemo.texto = req.body.texto;
        newMemo.save(function(err){
            if(err){
                response = {"error" : true, "message" : "Error adding data"};
            } else{
                response = {"error" : false, "message" : "Data added"};
            }
            res.json(response);
        });
    };

    /* PUT /memos/:id */
    updateMemo = function(req,res){
        var response = {};
        memo.findById(req.params.id,function(err,data){
            if(req.body.nombreFichero !== undefined){
                data.nombreFichero = req.body.nombreFichero;
            }
            if(req.body.fichero !== undefined){
                data.fichero = req.body.fichero;
            }
            if(req.body.fecha !== undefined){
                data.fecha = req.body.fecha;
            }
            if(req.body.texto !== undefined){
                data.texto = req.body.texto;
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

    /* DELETE /memos/:id */
    deleteMemo = function(req,res){
        var response = {};
        memo.findById(req.params.id, function(err,data){
           if(err){
               response = {"error" : true, "message" : "Error fetching data"};
           } else{
               memo.remove({_id : req.params.id}, function(err){
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

    /* DELETE /memos */
    deleteAllMemos = function(req,res){
        var response = {};

        memo.remove({}, function(err){
            if(err){
                response = {"error" : true, "message" : "Error deleting data"};
            } else{
                response = {"error" : false, "message" : "All memos deleted"};
            }
            res.json(response);
        });
    };

    app.get('/memos', findAllMemos);
    app.get('/memos/:id', findById);
    app.post('/memos', addMemo);
    app.put('/memos/:id',updateMemo);
    app.delete('/memos/:id',deleteMemo);
    app.delete('/memos', deleteAllMemos);
};