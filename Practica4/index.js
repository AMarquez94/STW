/**
 * Este fichero se encarga de inicializar los handlers para gestionar las
 * peticiones del cliente, y de iniciar el servidor.
 */

var server = require("./server" );
var router = require("./router" );
var requestHandlers = require("./requestHandlers" );

/* Los distintos handlers para atender las peticiones de los clientes
 * dependiendo del endpoint que escriban */
var handle = {};
handle["/" ] = requestHandlers.start;
handle["/start" ] = requestHandlers.start;
handle["/uploadMemo" ] = requestHandlers.uploadMemo;
handle["/setMemo"] = requestHandlers.setMemo;
handle["/showAllMemo"] = requestHandlers.showAllMemo;
handle["/showMemo"] = requestHandlers.showMemo;
handle["/deleteMemo"] = requestHandlers.deleteMemo;
handle["/downloadFile"] = requestHandlers.downloadFile;
handle["/login"] = requestHandlers.login;
handle["/loggedin"] = requestHandlers.loggedin;
handle["/logout"] = requestHandlers.logout;

/* Se inicia el servidor */
server.start(router.route, handle);