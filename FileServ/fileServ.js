//fileserv
var amazon = require('../BackEnd/amazon.js');
var bgen = require('../BlogServ/blogGen.js')
var contentTypes = new Array(10);
var files = new Array(10);
//tells the browser when the files were last modified. We assume that the last serverboot
//is the last time the files are modified because as of now the only way to 
//reload files is to reboot the server.
var serverBoot = (new Date()).toString().split('+')[0];
//expiration property of the file for browser cacheing.
var expire = (new Date(new Date().getTime() + 8000000000)).toString().split('+')[0];
console.log(serverBoot);
exports.servFile = function(path, res)
{
	path = path.replace(bgen.num, '');
	
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

exports.clearCache = function(){
	files = new Array(10);
}
