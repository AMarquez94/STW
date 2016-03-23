/**
 * Este fichero contiene las funciones encargadas de realizar operaciones con
 * la base de datos
 */

var mysql = require("mysql");

/**
 * Conecta a la base de datos con los parametros especificados y
 * devuelve el objeto perteneciente a esa conexion
 */
function connectToDb(){
    var con = mysql.createConnection({
       host: "localhost",
        user: "root",
        password: "976552288",
        database: "Memo_System"
    });

    con.connect(function(err){
        if(err){
            console.log('Error conectando a la base de datos');
            throw err;
        } else{
            console.log('Conexion establecida con la base de datos');
        }
    });

    return con;
}

/**
 * Desconecta el objeto pasado como parametro de la base de datos
 */
function disconnect(con){
    con.end(function(err){
       if(err){
           console.log('Error desconectando de la base de datos');
       } else{
           console.log('Desconexion realizada de la base de datos');
       }
    });
}

/**
 * Inserta la tarea con los campos especificados como parametro en la base de datos.
 * Despues, invoca la funcion callback con el resultado
 */
function insertMemo(texto, fecha, fichero, nombre, callback){
    var queryString;
    if(fichero == null){

        /* Tarea sin fichero */
        queryString = "INSERT INTO tareas (texto,fecha,fichero,nombreFichero) VALUES('" +
            texto + "',' " + fecha + "', " + null + ", " + null + ")";
    } else{

        /* Tarea con fichero */
        queryString = "INSERT INTO tareas (texto,fecha,fichero,nombreFichero) VALUES('" +
            texto + "',' " + fecha + "', 0x" + fichero + ", '" + nombre + "')";
    }
    var con = connectToDb();
    con.query(queryString, function(err, res){
        if(!err){
            console.log("Tarea subida con id: ", res.insertId);
        } else{
            console.log(err.message);
        }
        disconnect(con);
        callback(err);
    });
}

/**
 * Obtiene todas las tareas de la base de datos, y despues llama a la funcion
 * callback con el resultado
 */
function getAllMemo(callback){
    var con = connectToDb();
    con.query("SELECT *, DATE_FORMAT(fecha, '%d/%m/%Y') AS fechaFormateada FROM tareas"
        ,function(err,rows){
        if(!err) console.log("Obtenidas todas las tareas");
        disconnect(con);
        callback(err, rows);
    });
}

/**
 * Obtiene la tarea cuyo id es el pasado como parametro, y llama a la funcion
 * callback con el resultado
 */
function getMemo(id, callback){
    var con = connectToDb();
    con.query('SELECT * , DATE_FORMAT(fecha, "%d/%m/%Y") AS fechaFormateada FROM tareas WHERE id = ?'
        , id, function(err,row){
        if(!err) console.log("Obtenida tarea con id " + id);
        disconnect(con);
        callback(err,row);
    });
}

/**
 * Elimina la tarea cuyo id es el pasado como parametro, y despues llama a la funcion
 * callback con el resultado
 */
function deleteMemo(id, callback){
    var con = connectToDb();
    con.query('DELETE FROM tareas WHERE id = ?', id, function(err){
        if(!err) console.log("Eliminada tarea con id " + id);
        disconnect(con);
        callback(err);
    });
}

/**
 * Obtiene el fichero y el nombre del fichero de la tarea cuyo id es el pasado
 * como parametro, y despues llama a la funcion callback con el resultado
 */
function getBlob(id, callback){
    var con = connectToDb();
    con.query('SELECT fichero, nombreFichero FROM tareas WHERE id = ?', id, function(err,row){
        if(!err) console.log("Obtenido fichero de la tarea: " + id);
        disconnect(con);
        callback(err,row);
    });
}

exports.insertMemo = insertMemo;
exports.getAllMemo = getAllMemo;
exports.getMemo = getMemo;
exports.deleteMemo = deleteMemo;
exports.getBlob = getBlob;
