/**
 * Este fichero contiene los metodos para manejar las distintas peticiones
 * de los clientes, asi como metodos auxiliares para manejarlas.
 */

var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    db = require("./db"),
    view = require("./view"),
    url = require("url");

/**
 * Envia al cliente el formulario para subir una tarea
 */
function setMemo(response){
    console.log("Request handler 'setMemo' was called.");
    view.showHtml('./htmls/setMemo.html', function(err, body){
        if(!err){
            sendResponse(response,200,body);
        }
    });
}

/**
 * Envia al cliente el html correspondiente a la pagina inicial del sistema
 */
function start(response) {
    console.log("Request handler 'start' was called.");
    view.showHtml('./htmls/index.html', function(err, body){
        if(!err){
            sendResponse(response,200,body);
        }
    });
}

/**
 * Inserta en la base de datos la tarea subida por el cliente al sistema,
 * y le informa del resultado de la operacion.
 */
function uploadMemo(response, request) {
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");

    /* Parseamos el formulario para obtener los valores necesarios */
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");

        var nombre = files.Fichero.name;
        var path = files.Fichero.path;
        var fileSize = files.Fichero.size;

        if(fileSize == 0){

            /* Se inserta una tarea sin fichero */
            db.insertMemo(fields.Descripcion, fields.Fecha, null, nombre, function (err) {
                if (!err) {
                    view.showHtml('./htmls/uploadOK.html', function (err, body) {
                        sendResponse(response, 200, body);
                    });
                } else {
                    view.showHtml('./htmls/uploadNotOK.html', function (err, body) {
                        sendResponse(response, 500, body);
                    });
                }
            });
        } else {

            /* Se inserta una tarea con fichero -> Convertimos el fichero a blob */
            fs.open(path, 'r', function (err, fd) {
                if (err) {
                    view.showHtml('./htmls/uploadNotOK.html', function (err, body) {
                        sendResponse(response, 500, body);
                    });
                }
                else {
                    var buffer = new Buffer(fileSize);
                    fs.read(fd, buffer, 0, fileSize, 0, function (err) {
                        if (err) {
                            view.showHtml('./htmls/uploadNotOK.html', function (err, body) {
                                sendResponse(response, 500, body);
                            });
                        } else {
                            var blob = buffer.toString('hex');

                            /* Se inserta la tarea con fichero en la base de datos */
                            db.insertMemo(fields.Descripcion, fields.Fecha, blob, nombre, function (err) {
                                if (!err) {
                                    view.showHtml('./htmls/uploadOK.html', function (err, body) {
                                        sendResponse(response, 200, body);
                                    });
                                } else {
                                    view.showHtml('./htmls/uploadNotOK.html', function (err, body) {
                                        sendResponse(response, 500, body);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

/**
 * Envia al cliente el html con el listado de todas las tareas existentes
 * en la base de datos
 */
function showAllMemo(response){
    console.log("Request handler 'showAllMemo' was called.");

    /* Obtiene todas las tareas de la base de datos */
    db.getAllMemo(function(err,rows){
       if(!err){
            view.showAllMemo(rows,function(body){
                sendResponse(response,200,body);
            });
       } else{
           view.showHtml('./htmls/error.html', function (err, body) {
               sendResponse(response, 500, body);
           });
       }
    });
}

/**
 * Envia al cliente el html correspondiente a la tarea cuyo id ha sido pasado
 * en forma de peticion GET, mostrando asi la informacion de todos sus campos
 */
function showMemo(response, request){
    var query = url.parse(request.url).query;

    /* Se parsea la url */
    if(query==null){
        view.showHtml('./htmls/malformed.html', function(err, body){
            if(!err){
                sendResponse(response,400,body);
            }
        });
    } else{
        /* Se obtiene el valor del campo id de la peticion del cliente */
        var id = querystring.parse(query).id;
        if(id == null){
            view.showHtml('./htmls/malformed.html', function(err, body){
                if(!err){
                    sendResponse(response,400,body);
                }
            });
        }else {

            /* Se obtiene la informacion de la tarea correspondiente al id dado
            por el cliente */
            db.getMemo(id, function (err, row) {
                if (!err) {

                    /* La tarea existe */
                    if(row != null) {
                        view.showMemo(row, function (body) {
                            sendResponse(response, 200, body);
                        });
                    } else{

                        /* La tarea no existe */
                        view.showHtml('./htmls/doesntExist.html', function(err, body){
                            if(!err){
                                sendResponse(response,404,body);
                            }
                        });
                    }
                } else {
                    view.showHtml('./htmls/error.html', function (err, body) {
                        sendResponse(response, 500, body);
                    });
                }
            });
        }
    }
}

/**
 * Se elimina la tarea cuyo id ha sido pasado por el cliente en forma de peticion
 * GET, y se le informa del resultado de la eliminacion al mismo.
 */
function deleteMemo(response, request){

    /* Se parsea la URL */
    var query = url.parse(request.url).query;
    if(query==null){
        view.showHtml('./htmls/malformed.html', function(err, body){
            if(!err){
                sendResponse(response,400,body);
            }
        });
    } else{

        /* Se obtiene el valor del campo id pasado por el cliente como parametro */
        var id = querystring.parse(query).id;
        if(id == null){
            view.showHtml('./htmls/malformed.html', function(err, body){
                if(!err){
                    sendResponse(response,400,body);
                }
            });
        } else {

            /* Se elimina de la base de datos la tarea con el id pasado por el cliente */
            db.deleteMemo(id, function (err) {
                if (!err) {
                    view.showHtml('./htmls/deletedOK.html', function(err, body){
                        if(!err){
                            sendResponse(response,200,body);
                        }
                    });
                } else {
                    view.showHtml('./htmls/error.html', function (err, body) {
                        sendResponse(response, 500, body);
                    });
                }
            });
        }
    }
}

/**
 * En caso de existir, descarga el fichero correspondiente a la tarea con id
 * pasado por el cliente en forma de peticion GET
 */
function downloadFile(response, request){

    /* Se parsea la url */
    var query = url.parse(request.url).query;
    if(query==null){
        view.showHtml('./htmls/malformed.html', function(err, body){
            if(!err){
                sendResponse(response,400,body);
            }
        });
    } else{

        /* Se obtiene el valor del campo id pasado por el cliente como parametro */
        var id = querystring.parse(query).id;
        if(id == null){
            view.showHtml('./htmls/malformed.html', function(err, body){
                if(!err){
                    sendResponse(response,400,body);
                }
            });
        } else {

            /* Se obtiene el blob correspondiente a la tarea con el id pasado
             * como argumento, y se renombra con su nombre correspondiente */
            db.getBlob(id, function (err, row) {
                if (!err) {

                    if(row.nombreFichero != null) {

                        /* El fichero existe */
                        response.setHeader('Content-disposition', 'attachment; filename="' +
                            row.nombreFichero + '"');
                        response.writeHead(200, {
                            "Content-Type": "application/octet-stream",
                        });
                        response.end(new Buffer(row.fichero,'hex'));
                    } else{

                        /* El fichero no existe */
                        view.showHtml('./htmls/fileNotFound.html', function(err, body){
                            if(!err){
                                sendResponse(response,404,body);
                            }
                        });
                    }
                } else {
                    view.showHtml('./htmls/error.html', function (err, body) {
                        sendResponse(response, 500, body);
                    });
                }
            });
        }
    }
}

/**
 * Envia la respuesta al cliente con el codigo y cuerpo pasados como parametro
 */
function sendResponse(response, code, body){
    response.writeHead(code, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

exports.start = start;
exports.uploadMemo = uploadMemo;
exports.setMemo = setMemo;
exports.showAllMemo = showAllMemo;
exports.showMemo = showMemo;
exports.deleteMemo = deleteMemo;
exports.downloadFile = downloadFile;