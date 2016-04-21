/**
 * Este fichero contiene el servidor, el cual se queda escuchando en el puerto
 * 8888 las peticiones de los clientes, y los atiende dependiendo del tipo de
 * las mismas.
 */

var http = require("http");
var url = require("url");

function start(route, handle) {


    function onRequest(request, response) {

        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");

        /* Pasamos a procesar la peticion del cliente */
        route(handle, pathname, response, request);
    }

    /* El servidor escucha el puerto 8888 */
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start; 
