//Routing
var http = require('http'),
    url = require('url'),
	fs = require("fs"),
    PC = require('./TagEngine/PostCollector.js'),
    QR = require('./BlogServ/QueryResolver.js'),
    restore = require('./BackEnd/backupGen.js'),
    gen = require('./BlogServ/blogGen.js'),
	fserv = require('./FileServ/fileServ.js'),
	cal = require('./BlogServ/calGen.js');
	


exports.routeURL = function(req, res){

	  var search = url.parse(req.url).search;
		var path = url.parse(req.url).pathname;
		//console.log(req);
		console.log("path: " + path + " search: " + search);
		
		if(search != undefined && (path == undefined || path == "/"))
		{
			console.log("was here 3");
			querySolver(search, res);
		}
		else if(search == undefined && (path == undefined || path == "/"))
		{
			fileServer(path, res);
		}
		else if(search != undefined && (path == undefined || path == "/"))
		{
			fileServer("/404.html", res);
		}

};


var fileServer = function(path, res){

	if(path ==  "/" || path == "/index" || path == "/index.html"){
		specialFile("index", res);
		return;
	}
	if(path == "/stats" || path == "/stats.html"){
		specialFile("stats", res);
		return;
	}
	if(path == "/printKey" || path == "/printkey.html"){
		specialFile("printKey", res);
		return;
	}
	fserv.servFile(path, res);

}

var specialFile = function(url, res)
{
	if(url == "index")
		querySolver("?num=0:10", res);
	if(url == "stats")
		console.log("stats");
	if(url == "printKey"){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end("Key Printed");
		console.log(key);
	}

}

var querySolver = function(search, res){
//we go ahead and directly server search queryies as that has its own resolver.
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(gen.templatehead);	
		res.write(cal.cal);
		res.write(gen.cal);
		console.log("was here 2");
		var resp = QR.resolveQuery(search);
		res.write(resp);
		res.write(gen.templateend);
		res.end();
		console.log("Search = " + search + '\n' + resp);
}
//Our security key.
var key = getKey(10);

function getKey(length)
{
	var key = "";
	for(var i = 0; i < length; i++){
	 var rand=Math.floor(Math.random() * 255);
		key += rand + ":";
	}
	return key;
}
