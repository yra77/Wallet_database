
let http = require('http');
var express = require('express');
var routes = require('./routes/route');

var main = require('./index');

 var app = express();
 app.use(express.static(__dirname + '/viev'));
 app.use(express.static(__dirname + '/viev/js'));
 app.use(express.static(__dirname + '/viev/css'));

var server = app.listen(8080, function (req, res) 
{
 var host = server.address().address;
 var port = server.address().port
 console.log("app listening at ", host, port)
});


routes(app, main);
main.Main();