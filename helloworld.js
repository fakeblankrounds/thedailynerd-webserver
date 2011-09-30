var http = require('http');


var port = 8888;
var serverResponce = function (req, res) {


	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<html><head></head><body><div style="background-color:red"></div></body></html>');
	setInterval(function(){res.write("hello World");}, 1000);
};

http.createServer(serverResponce).listen(port);
console.log('Server Running at 127.0.0.1:' + port);