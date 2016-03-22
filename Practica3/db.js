var mysql = require("mysql");

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
    })

    return con;
}

function disconnect(con){
    con.end(function(err){
       if(err){
           console.log('Error desconectando de la base de datos');
       } else{
           console.log('Desconexion realizada');
       }
    });
}

function insertMemo(texto, fecha){
    var tarea = {texto: texto, fecha: fecha};
    try {
        var con = connectToDb();
        con.query('INSERT INTO tareas SET ?', tarea, function (err, res) {
            if (err) throw err;
            console.log('Last insert ID:', res.insertId);
        });
        disconnect(con);
        return true;
    } catch(err) {
        disconnect(con);
        return false;
    }
}

exports.insertMemo = insertMemo;