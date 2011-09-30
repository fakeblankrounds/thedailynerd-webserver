//s3 AmazonGet
var http = require('http');

var error404 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head><title>Error</title></head><body style="text-align:center;"><h1> SUCCESS </h1><h3> we found your page <h3></body></html>';

exports.loadFile = function (path, returnF, responce) {
    exports.data = "";
    var options = {
        method: 'GET',
        host: 's3.amazonaws.com',
        port: 80,
        path: '/dailynerd' + path
    };
	var thisData = "";
    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
		if(res.statusCode == 200){	
        //console.log('HEADERS: ' + JSON.parse(res.headers));
		var header = JSON.stringify(res.headers).split(',');
		var contentType = "";
		for(var head in header)
		{
			if(header[head].search("content-type") > 0){
			   // console.log(contentType);
				contentType = header[head];
				//console.log(contentType);
			}
		}
		//console.log(contentType);
		contentType = contentType.split(':')[1];
		if(contentType != undefined){
			contentType = contentType.replace(/["']{1}/gi,"");
		console.log(contentType);
		if(contentType.search("image") >= 0){
			res.setEncoding('binary');
			console.log("Encoding: binary");
			}
		else
			res.setEncoding('utf8');
        res.on('data', function (data) {
            thisData += data;
        }); }}
		else{
		thisData = error404;
		contentType="text/html";
		path="/404";
		}
        res.on('end', function(){ returnF(path, contentType, thisData, responce)});
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();
};