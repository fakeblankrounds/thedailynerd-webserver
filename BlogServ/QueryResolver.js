//Copyright Nick Tkachov 2011.

//this file provides an access point for any sort of search querys and 
//acts as a front end for the PostCollector that records and sorts all the posts.
var PC = require('../TagEngine/PostCollector.js');

var error = "Sorry, This feature is still in production.";

//Set the functions to return errors in case we call a function
//that hasnt been yet implemented.
exports.getPostByTagFunction = function (query) {
    return error;
};
exports.getPostFunction = function (query) {
	console.log("was here1")
    return error;
}
exports.getTagsFunction = function (query) {
    return error;
};
exports.defaultFunction = function (query) {
    return "Sorry that is not a valid request";
};
exports.getPostsFunction = function (query) {
	return error;
};
exports.getSearchFunction = function(query){
	return error;
};

//set up a hash for quickly resolving querys
var queryList = new Array(4);
//where will return a list of posts that are taged with a specific tag
//post will return a single post given a path (usually '/posts/*.html');
//tags will return the tags for a given post path ('/posts/*html');
//num will return the posts numbered from n1:n2
//search is not yet implemented.
queryList["where"] = exports.getPostByTagFunction;
queryList["post"] = exports.getPostFunction;
queryList["tags"] = exports.getTagsFunction;
queryList["num"] = exports.getPostsFunction;
queryList["search"] = exports.getSearchFunction;


//Quick reload for when we reassign the functions. the reassign can be done externally
//but we want to keep the query list as local as possible.
exports.reloadQuery = function () {
    queryList["where"] = exports.getPostByTagFunction;
    queryList["post"] = exports.getPostFunction;
    queryList["tags"] = exports.getTagsFunction;
	queryList["num"] = exports.getPostsFunction;
	queryList["search"] = exports.getPostsFunction;
}

/*
Purpose:
	Parses the quiery. Determines and runs the matching function from the queryList hash.
Params:
	path - the single query that will be parsed (eg. "where=something")
*/
var handleQuery = function (path) {
        var query = path.split("=");
        console.log(query);

        if (query[0] in queryList) return queryList[query[0]](query[1]);
        else return exports.defaultFunction(query[0]);

    }
//Allow external access
exports.handleQuery = handleQuery;

/*
Purpose:
	Provides and entry point for the query resolver. Splits propper queries and uses handleQuery to
	access the result.
Params:
	path - a '?' delimited list of querys for which results need to be returned.
*/
exports.resolveQuery = function (path) {
    var splitQuery = path.split("?");
    console.log(splitQuery);
	var resolved = ""
    for (q in splitQuery) {
        if (splitQuery[q] != '') {
            console.log(splitQuery[q]);
            resolved += handleQuery(splitQuery[q]);
        }
    }
	return resolved;
}


//A quick load function to start up the blog server. 
//this can be changed at any time to change the functionality of the server 
//depending on the needs of users.
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
		console.log("was here");
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
		for(var i = range[0]; i <= range[1]; i++)
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
	//reload the query handler.
    exports.reloadQuery();

}