//bloggen
var http = require('http');

var PC = require('../TagEngine/PostCollector.js');
exports.templatehead = "";
exports.cal = "";
exports.templateend = "";
var template = "";


exports.loadTemplate = function(){
	//exports.num = (Math.random() *100) * (Math.random()  * 1000 ) * (Math.random() * 10000) ; //we generate a random number for our current version.
	
	num1 = (Math.random() *100) * (Math.random()  * 1000 ) * (Math.random() * 10000) ;
	num2 = (Math.random() *100) * (Math.random()  * 1000 ) * (Math.random() * 10000) ;
	num3 = (Math.random() *100) * (Math.random()  * 1000 ) * (Math.random() * 10000) ;
	num4 = (Math.random() *100) * (Math.random()  * 1000 ) * (Math.random() * 10000) ;
	exports.num = Math.round(num1) + "" + Math.round(num2) + "" + Math.round(num3) + "" + Math.round(num4);
console.log(exports.num);
var options = {
	method: 'GET',
  host: 's3.amazonaws.com',
  port: 80,
  path: '/dailynerd/template.html'
};
var req = http.request(options, function(res) {
	template="";
  console.log('STATUS: ' + res.statusCode);
 // console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function(data){
  template+=data; 
  });
  res.on('end', splitTemplate);
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();
};

var splitTemplate = function()
{
	var temp = template.split("<!--%8$*54-->");
	exports.templatehead=temp[0];
	exports.cal = temp[1];
	exports.templateend=temp[2];
	
	exports.templatehead = exports.templatehead.replace('css/bace.css', 'css/bace' + exports.num + '.css');
	exports.templateend = exports.templateend.replace('js/debug.js', 'js/debug' + exports.num + '.js');
};

exports.wrapPost = function(post){
	return templatehead + post + templateend;
};

exports.switchTags = function()
{
	/*var posts = PC.getPostCounts();
	var h3 = 0,h2 = 0,h1 = 0;
	var 
	for(var i in posts)
	{*/
		
};