//File loader 
var http = require('http');
var sax = require('./lib/sax.js');
var amazon = require('./amazon.js');
var PC = require('./TagEngine/PostCollector.js');
exports.cal = "";

var calText = ' <div class="sideblock"> <h4 class="events">Reminders:</h4></div><div class="CalWidget sideblock"><div class="CalBar"><p class="headline"> #&$1 </p><p class="time">#&$1t</p></div><div class="MidBar"><p class="headline">#&$2</p><p class="time">#&$2t</p></div><div class="MidBar"> <p class="headline">#&$3</p><p class="time">#&$3t</p></div><div class="BotBar"><p class="headline">#&$4</p><p class="time">#&$4t</p></div></div>';
exports.loadCal = function(){
amazon.loadFile("/cal.txt", function(path, contentType, thisData, responce){

	var days = thisData.split('|');
	var i = 1;
	exports.cal = calText;
	for(var d in days)
	{
		day = days[d].split(':');
		exports.cal = exports.cal.replace("#&$" + i, day[0]);
		exports.cal = exports.cal.replace("#&$" + i + 't', day[1]);
		i++;
	}
	console.log(exports.cal);

},"");
}