/**
 * Este fichero se encarga de generar los ficheros html que seran enviados
 * al cliente en respuesta a sus peticiones
 */

var fs = require("fs");

/**
 * Lee el fichero html pasado por parametro y llama a la funcion de callback
 * con el resultado
 */
function showHtml(path, callback){
    fs.readFile(path, function(err,body){
        callback(err,body);
    });
}

/**
 * Genera el fichero html correspondiente al listado de todas las tareas, y llama
 * a la funcion callback con el resultado
 */
function showAllMemo(rows, callback){
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" '+
        'content="text/html; charset=UTF-8" />'+
        '<style>' +
        'td{text-align: center;}' +
        '</style>' +
        '</head>'+
        '<body>' +
        '<h1>Listado de tareas</h1>' +
        '<table border="1" style="width:100%">' +
        '<tr>' +
        '<th>ID</th>' +
        '<th>Texto</th>' +
        '<th>Fecha</th>' +
        '<th>Fichero</th>' +
        '<th>Eliminar</th></tr>';

    /* Escribe la informacion de cada tarea */
    for (var i = 0; i < rows.length; i++) {
        body = body +
                '<tr>'+
                '<td><a href="showMemo?id=' + rows[i].id + '">' + rows[i].id + '</a></td>' +
                '<td>' + rows[i].texto + '</td>' +
                '<td>' + rows[i].fechaFormateada + '</td>';
        if(rows[i].fichero == null){

            /* La tarea no tiene fichero */
            body = body + '<td>Tarea sin fichero</td>';
        } else{

            /* La tarea tiene fichero */
            body = body + '<td><a href="downloadFile?id=' + rows[i].id + '">' +
                rows[i].nombreFichero + '</a></td>'
        }
        body = body + '<td><a href="deleteMemo?id=' + rows[i].id + '">Eliminar tarea</a></td></tr>';
    };

    body = body + '</table>'+
        '<p><a href="start">Volver al inicio</a></p>' +
        '<p><a href="setMemo">Agregar tarea</a></p>' +
        '</body>'+
        '</html>';

    callback(body);
}

/**
 * Genera el fichero html correspondiente a la informacion de la tarea pasada como
 * parametro, y llama a la funcion callback con el resultado
 */
function showMemo(row, callback){
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" '+
        'content="text/html; charset=UTF-8" />'+
        '<style>' +
        'td{text-align: center;}' +
        '</style>' +
        '</head>'+
        '<body>'+
        '<h1>Tarea ' + row[0].id + '</h1>'+
        '<table border="1" style="width:100%">' +
        '<tr>' +
        '<td style="width:20%"><b>Texto</b></td>' +
        '<td style="width:80%">' + row[0].texto + '</td>' +
        '</tr>'+
        '<tr>' +
        '<td style="width:20%"><b>Fecha límite</b></td>' +
        '<td style="width:80%">' + row[0].fechaFormateada + '</td>' +
        '</tr>'+
        '<tr>' +
        '<td style="width:20%"><b>Fichero adjunto</b></td>';

    if(row[0].fichero == null){

        /* La tarea no tiene fichero */
        body = body + '<td style="width:80%">Tarea sin fichero</td>';
    } else{

        /* La tarea tiene fichero */
        body = body + '<td style="width:80%"><a href="downloadFile?id=' +
            row[0].id + '">' + row[0].nombreFichero + '</a></td>';
    }
        body = body + '</tr>'+
        '</table>' +
        '<p><a href="start">Volver al inicio</a></p>' +
        '<p><a href="showAllMemo">Volver al listado de tareas</a></p>' +
        '</body>'+
        '</html>';
    callback(body);
}

exports.showHtml = showHtml;
exports.showAllMemo = showAllMemo;
exports.showMemo = showMemo;