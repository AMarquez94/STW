/**
 * Este fichero contiene el enrutador, funcion encargada de asignar a cada peticion
 * su handler adecuado. En caso de no haber un handler disponible para ese tipo de
 * peticion, el cliente obtiene un error
 */
function route(handle, pathname, response, request) {
	console.log("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function') {

		/* Hay un handler para la peticion del cliente */
		handle[pathname](response, request);
	} else {

		/* No existe un handler para la peticion del cliente */
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/html"});
		response.write("404 Not found");
		response.end();
	}
}
exports.route = route;