//fileserv
var amazon = require('./amazon.js');
var contentTypes = new Array(10);
var files = new Array(10);
var serverBoot = (new Date()).toString().split('+')[0];
var expire = (new Date(new Date().getTime() + 8000000000)).toString().split('+')[0];
console.log(serverBoot);
exports.servFile = function(path, res)
{
	//check to see if files has the file
	if(files[path] === undefined)
		amazon.loadFile(path,getandServFile, res);
	else{
		res.writeHead(200, {"content-type" : contentTypes[path], "Last-Modified" : serverBoot, "Expires" : expire, "Cache-Control": "max-age=8000000000"});
		if(contentTypes[path].search("image") >= 0){
			res.write(files[path], "binary");
			res.end();
		}
		else
			res.end(files[path]);
		console.log(path + " served from cache");
	}
	
}

var getandServFile = function(path,contentType, data, res)
{
	contentTypes[path] = contentType;
	files[path] = data;
	res.writeHead(200, {"content-type" : contentTypes[path], "Last-Modified" : serverBoot, "Expires" : expire, "Cache-Control": "max-age=8000000000"});

	if(contentType.search("image") >= 0){
		res.write(data, "binary");
		res.end();
	}
	else
		res.end(data);
}
/*
var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    path.exists(filename, function(exists) {
    	if(!exists) {
    		response.sendHeader(404, {"Content-Type": "text/plain"});
    		response.write("404 Not Found\n");
    		response.close();
    		return;
    	}

    	fs.readFile(filename, "binary", function(err, file) {
    		if(err) {
    			response.sendHeader(500, {"Content-Type": "text/plain"});
    			response.write(err + "\n");
    			response.close();
    			return;
    		}

    		response.sendHeader(200);
    		response.write(file, "binary");
    		response.close();
    	});
    });
}).listen(8080);

sys.puts("Server running at http://localhost:8080/");*/
