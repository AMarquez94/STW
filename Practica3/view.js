var fs = require("fs");

function showSetMemo(response){
    fs.readFile('./htmls/setMemo.html', function(err,body){
        console.log(err);
        if(!err){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(body);
            response.end();
        }
    });
}

function showSetMemoOk(response){
    fs.readFile('./htmls/setMemoOK.html', function(err,body){
        console.log(err);
        if(!err){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(body);
            response.end();
        }
    });
}

function showSetMemoNotOk(response){
    fs.readFile('./htmls/setMemoNotOK.html', function(err,body){
        console.log(err);
        if(!err){
            response.writeHead(500, {"Content-Type": "text/html"});
            response.write(body);
            response.end();
        }
    });
}

exports.showSetMemo = showSetMemo;
exports.showSetMemoOk = showSetMemoOk;
exports.showSetMemoNotOk = showSetMemoNotOk;