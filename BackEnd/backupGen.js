//File loader 
var http = require('http');
var sax = require('../lib/sax.js');
var amazon = require('./amazon.js');
var PC = require('../TagEngine/PostCollector.js');

var loadArray = Array(3);
var loadNum = Array(3);
var pathLoad = Array(3);

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
var xml_counter = 0;
parser.ontext = function (t) {
	t= t.replace(/\r\n/g,'')
	if(ptr >= 0 && !(t == '')){
		//  console.log("Text:" + t + "   " + t.length + "ptr: " + ptr);
		post[ptr] = t;
		if(ptr == 0)
		{
			pathLoad[t] = false;
			loadNum[t] = xml_counter;
			xml_counter++;
		}
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
			
			loadArray[loadNum[path]] = new Array(3);
			loadArray[loadNum[path]][0] = path;
			loadArray[loadNum[path]][1] = thisData;
			loadArray[loadNum[path]][2] = responce;
			pathLoad[path] = true;
		
			var allposts = true;
			for(var i in pathLoad)
			{
				if(pathLoad[i] == false)
					allposts = false;
			}
			if(allposts == true)
			{
				//console.log(loadArray);
				addtoPosts();
			}
		},post[1].split(',')) ;
	}
};
var addtoPosts = function () {
    
	for(var v in loadArray)
	{
		PC.addPost(loadArray[v][0], loadArray[v][1],loadArray[v][2]);
		//console.log("post added" + v[0]);
	}
	loadArray = [];
	pathLoad = [];
	count = 0;
};
var process = function (data) {
        parser.write(data);
    };