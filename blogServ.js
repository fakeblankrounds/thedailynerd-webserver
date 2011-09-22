//./node .\WebDev\thedailynerd\node.js\blogServ.js
var http = require('http'),
    url = require('url'),
    PC = require('./TagEngine/PostCollector.js'),
    QR = require('./QueryResolver.js'),
    restore = require('./backupGen.js'),
    gen = require('./blogGen.js'),
    fs = require("fs"),
	fserv = require('./fileServ.js'),
	cal = require('./calGen.js');


restore.restore();
gen.loadTemplate();
cal.loadCal();

var port = 80;
var serverResponce = function (req, res) {
        var search = url.parse(req.url).search;
		var path = url.parse(req.url).pathname;
		//console.log(req);
		console.log("path: " + path + " search: " + search);
		
		
		//res.writeHead(200, {'Content-Type': 'application/json'});
        //res.end('_testcb(\'{"message": "' + resp + '"}\')');
		if((path ==  "/" || path == "/index" || path == "/index.html") && search == undefined )
		{
			search = "?num=0:10";
		}
		
		
		if(search != undefined){
			res.writeHead(200, {'Content-Type': 'text/html'});
			console.log("Search = " + search);
			//search = search.replace(new RegExp(/\//g), '');
			
			res.write(gen.templatehead);
			console.log("temphead");
			res.write(cal.cal);
			console.log("cal cal");
			res.write(gen.cal);
			console.log("gen cal");
			var resp = QR.resolveQuery(search);
			res.write(resp);
			res.write(gen.templateend);
			res.end();
		}
		if(path != undefined && !(path ==  "/" || path == "/index" || path == "/index.html") ){
			fserv.servFile(path, res);
		}
		//res.end();
    }

http.createServer(serverResponce).listen(port);
console.log('Server Running at 127.0.0.1:' + port);

QR.blogServ();

setInterval(cal.loadCal(), 86400000);