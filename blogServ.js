//./node .\WebDev\thedailynerd\node.js\blogServ.js
var http = require('http'),
    url = require('url'),
	fs = require("fs"),
    PC = require('./TagEngine/PostCollector.js'),
    QR = require('./BlogServ/QueryResolver.js'),
    restore = require('./BackEnd/backupGen.js'),
    gen = require('./BlogServ/blogGen.js'),
	fserv = require('./FileServ/fileServ.js'),
	cal = require('./BlogServ/calGen.js');
	
var router = require('./Router.js');
restore.restore();
gen.loadTemplate();
cal.loadCal();

var port = 80;

http.createServer(router.routeURL).listen(port);
console.log('Server Running at 127.0.0.1:' + port);

QR.blogServ();

var reloadServer = function()
{
	PC.clearPosts();
	gen.loadTemplate();
	cal.loadCal();
	fserv.clearCache();
	restore.restore();
	console.log("Server Reloaded");
};

