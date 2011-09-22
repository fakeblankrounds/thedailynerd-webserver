//provides a way to handle querys
var PC = require('./TagEngine/PostCollector.js');

exports.getPostByTagFunction = function (query) {
    return "function undefined";
};
exports.getPostFunction = function (query) {
    return "function undefined";
}
exports.getTagsFunction = function (query) {
    return "function undefined";
};
exports.defaultFunction = function (query) {
    return "function undefined";
};
exports.getPostsFunction = function (query) {
	return "function undefined";
};

var queryList = new Array(4);
queryList["where"] = exports.getPostByTagFunction;
queryList["post"] = exports.getPostFunction;
queryList["tags"] = exports.getTagsFunction;
queryList["num"] = exports.getPostsFunction;

exports.reloadQuery = function () {
    queryList["where"] = exports.getPostByTagFunction;
    queryList["post"] = exports.getPostFunction;
    queryList["tags"] = exports.getTagsFunction;
	queryList["num"] = exports.getPostsFunction;
}

var handleQuery = function (path) {
        var query = path.split("=");
        console.log(query);

        if (query[0] in queryList) return queryList[query[0]](query[1]);
        else return exports.defaultFunction(query[0]);

    }

exports.handleQuery = handleQuery;

exports.resolveQuery = function (path) {
    var splitQuery = path.split("?");
    console.log(splitQuery);
    for (q in splitQuery) {
        if (splitQuery[q] != '') {
            console.log(splitQuery[q]);
            return handleQuery(splitQuery[q]);
        }
    }
}

exports.blogServ = function () {

    exports.getPostByTagFunction = function (query) {
        var resp = PC.getPostByTag(query);
        var post = "";
        for (var i in resp) {
            post += PC.getPost(resp[i]);
        }
        if (post === undefined) return "No such posts exist";
        return post.toString();
    };
    exports.getPostFunction = function (query) {
        var resp = PC.getPost(query);
        if (resp === undefined) return "No such posts exist";
        return resp.toString();
    };
    exports.getTagsFunction = function (query) {
        var resp = PC.getTags(query);
        if (resp === undefined) return "No such posts exist";
        return resp.toString();
    };
    exports.defaultFunction = function (query) {
        var resp = query + "  is not a valid query";
        if (resp === undefined) return "No such posts exist";
        return resp.toString();
    };
	exports.getPostsFunction = function (query) {
		console.log(query);
		var range = query.split(":");
		console.log(JSON.stringify(range));
		var resp = "";
		if(range[0] < range[1]){
		for(var i = range[1]; i >= range[0]; i--)
		{
			
			var p = PC.getPost(PC.getPostByNumber(i));
			console.log(PC.getPostByNumber(i) + "____" + i);
			if(p != undefined)
				resp += p;
		}
		}
		else
		{
		for(var i = range[0]; i >= range[1]; i--)
		{
			var p = PC.getPost(PC.getPostByNumber(i));
			console.log(PC.getPostByNumber(i) + "____" + i);
			if(p != undefined)
				resp += p;
		}
		
		}
		if(resp == "") return "No posts were found";
		return resp.toString();
	};

    exports.reloadQuery();

}