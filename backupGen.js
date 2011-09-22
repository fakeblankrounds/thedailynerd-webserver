//File loader 
var http = require('http');
var sax = require('./lib/sax.js');
var amazon = require('./amazon.js');
var PC = require('./TagEngine/PostCollector.js');


exports.restore = function () {

    var options = {
        method: 'GET',
        host: 's3.amazonaws.com',
        port: 80,
        path: '/dailynerd/posts.xml'
    };

    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', process);
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();
};
var parser = sax.parser(true);

var post = new Array(2);
var ptr = 0;

parser.onerror = function (e) {
    //console.log("Error:" + e);
};
parser.ontext = function (t) {
	t= t.replace(/\r\n/g,'')
	if(ptr >= 0 && !(t == '')){
		//  console.log("Text:" + t + "   " + t.length + "ptr: " + ptr);
		post[ptr] = t;
	}
};
parser.onopentag = function (node) {
	if(node.name == "post")
		post = new Array(2);
	else if(node.name == "path")
		ptr = 0;
	else if(node.name == "tags")
		ptr = 1;
	else
		ptr = -1;
		
	//console.log("openTag:" + node.name + ptr);
};
parser.onclosetag = function (node){
	if(node == "post"){
		//console.log("Post = " + JSON.stringify(post));
		amazon.loadFile(post[0], function(path, contentType, thisData, responce){
			PC.addPost(path, thisData, responce);
			//console.log("amazon" + path + " " + thisData);
		},post[1].split(',')) ;
	}
};
parser.onend = function () {
    console.log("done");
};
var process = function (data) {
        parser.write(data);
    };